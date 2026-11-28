// See docs/feature-map.md, "How the links are found".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), '../mobile/src');
const APP = path.join(SRC, 'app');
const ROUTER_METHODS = new Set(['push', 'navigate', 'replace', 'dismissTo']);
const PASS_THROUGH = new Set(['toTab']);
const LABEL_PROPS = ['accessibilityLabel', 'label', 'aria-label', 'title', 'name'];

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(file);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [file] : [];
  });
}

const rel = file => path.relative(SRC, file);

function resolveImport(from, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const ending of ['', '.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const file = base + ending;
    if (fs.existsSync(file) && fs.statSync(file).isFile() && file.startsWith(SRC)) return file;
  }
  return null;
}

const routeLiteral = text => (/^\/[a-z[(]/.test(text) || text === '/' ? text.split('?')[0] : null);

function routesIn(node, consts) {
  const found = new Set();
  const visit = n => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const route = routeLiteral(n.text);
      if (route) found.add(route);
    } else if (ts.isTemplateExpression(n)) {
      const route = routeLiteral(`${n.head.text}[param]`);
      if (route) found.add(route.replace(/\/\[param\].*$/, '/[param]'));
    } else if (ts.isIdentifier(n) && consts?.has(n.text)) {
      for (const route of consts.get(n.text)) found.add(route);
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
}

function textOf(expr) {
  if (!expr) return null;
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  if (ts.isJsxExpression(expr)) return textOf(expr.expression);
  if (ts.isTemplateExpression(expr)) return expr.head.text + expr.templateSpans.map(span => `‹›${span.literal.text}`).join('');
  if (ts.isConditionalExpression(expr)) return textOf(expr.whenFalse) ?? textOf(expr.whenTrue);
  if (ts.isParenthesizedExpression(expr)) return textOf(expr.expression);
  return null;
}

function labelNear(node) {
  for (let n = node.parent; n; n = n.parent) {
    if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && ts.isVariableDeclaration(n.parent)) return null;
    if (ts.isPropertyAssignment(n) && ts.isObjectLiteralExpression(n.parent) && !n.parent.properties.some(p => ts.isPropertyAssignment(p) && ['label', 'title', 'name'].includes(p.name.getText()))) return null;
    if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) {
      for (const name of LABEL_PROPS) {
        const attr = n.attributes.properties.find(prop => ts.isJsxAttribute(prop) && prop.name.getText() === name);
        const text = attr && textOf(attr.initializer);
        if (text) return text;
      }
      return null;
    }
    if (ts.isJsxElement(n)) {
      const text = n.children.map(child => (ts.isJsxText(child) ? child.text : textOf(child) ?? '')).join('').trim();
      return text || null;
    }
    if (ts.isObjectLiteralExpression(n)) {
      for (const name of ['label', 'title', 'name']) {
        const prop = n.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText() === name);
        const text = prop && textOf(prop.initializer);
        if (text) return text;
      }
    }
    if (ts.isFunctionDeclaration(n) && n.parent && ts.isSourceFile(n.parent)) return null;
  }
  return null;
}

function keyNear(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isJsxAttribute(n)) return n.name.getText();
    if (ts.isPropertyAssignment(n)) return n.name.getText();
    if (ts.isVariableDeclaration(n)) return n.name.getText();
    if (ts.isSourceFile(n.parent ?? n)) return null;
  }
  return null;
}

function topLevelOwner(node) {
  for (let n = node; n.parent; n = n.parent) {
    if (ts.isSourceFile(n.parent)) {
      if (ts.isFunctionDeclaration(n)) return n.name?.text ?? 'default';
      if (ts.isVariableStatement(n)) return n.declarationList.declarations[0].name.getText();
      if (ts.isExportAssignment(n)) return 'default';
      return null;
    }
  }
  return null;
}

const isHelperName = name => !!name && /^[a-z]/.test(name) && !/^use[A-Z]/.test(name);

/** Reads every file once: imports, top-level helpers and the places that navigate or open a sheet. */
function parse(file) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const imports = new Map();
  const deps = new Set();
  const consts = new Map();
  const keyed = new Map();
  const helpers = new Map();
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const target = resolveImport(file, statement.moduleSpecifier.text);
      if (!target) continue;
      deps.add(target);
      const names = statement.importClause?.namedBindings;
      if (names && ts.isNamedImports(names)) for (const el of names.elements) imports.set(el.name.text, { file: target, name: (el.propertyName ?? el.name).text });
      if (statement.importClause?.name) imports.set(statement.importClause.name.text, { file: target, name: 'default' });
    } else if (ts.isVariableStatement(statement)) {
      for (const decl of statement.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
        if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) helpers.set(decl.name.text, decl.initializer);
        else {
          consts.set(decl.name.text, routesIn(decl.initializer));
          if (ts.isObjectLiteralExpression(decl.initializer)) {
            const byKey = new Map();
            for (const prop of decl.initializer.properties) {
              const route = ts.isPropertyAssignment(prop) && (ts.isStringLiteral(prop.initializer) || ts.isNoSubstitutionTemplateLiteral(prop.initializer)) && routeLiteral(prop.initializer.text);
              if (route) byKey.set(prop.name.getText().replace(/['"]/g, ''), route);
            }
            if (byKey.size) keyed.set(decl.name.text, byKey);
          }
        }
      }
    } else if (ts.isFunctionDeclaration(statement) && statement.name) helpers.set(statement.name.text, statement);
  }
  const tops = new Map();
  for (const statement of source.statements) {
    const names = ts.isFunctionDeclaration(statement) ? [statement.name?.text ?? 'default']
      : ts.isVariableStatement(statement) ? statement.declarationList.declarations.map(decl => decl.name.getText())
      : ts.isExportAssignment(statement) ? ['default'] : [];
    const isDefault = ts.isFunctionDeclaration(statement) && statement.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);
    for (const name of isDefault && statement.name ? [statement.name.text, 'default'] : names) tops.set(name, statement);
  }
  const visitRequire = n => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'require' && n.arguments[0] && ts.isStringLiteral(n.arguments[0])) {
      const target = resolveImport(file, n.arguments[0].text);
      if (target) deps.add(target);
    }
    ts.forEachChild(n, visitRequire);
  };
  visitRequire(source);
  return { file, source, imports, deps, consts, keyed, helpers, tops };
}

/** The routes a call opens: a router call or toTab by its argument, any other function by what its body opens. */
function callTargets(parsed, call, helperRoutes) {
  const callee = call.expression;
  if (ts.isPropertyAccessExpression(callee) && callee.expression.getText() === 'router' && ROUTER_METHODS.has(callee.name.text)) {
    return routesIn(call.arguments[0] ?? call, parsed.consts);
  }
  if (ts.isIdentifier(callee)) {
    const ref = refOf(parsed, callee.text);
    if (ref && PASS_THROUGH.has(ref.name)) return routesIn(call.arguments[0] ?? call, parsed.consts);
    if (ref) {
      let routes = new Set(helperRoutes(ref));
      const picked = keyedPick(ref, call);
      if (picked.size) routes = picked;
      const at = passesOn(ref);
      if (at !== -1 && call.arguments[at]) for (const route of routesIn(call.arguments[at], parsed.consts)) routes.add(route);
      return routes;
    }
  }
  return new Set();
}

let passesOn = () => -1;
let keyedPick = () => new Set();

function isNavPrimitive(parsed, call) {
  const callee = call.expression;
  if (ts.isPropertyAccessExpression(callee)) return callee.expression.getText() === 'router' && ROUTER_METHODS.has(callee.name.text);
  return ts.isIdentifier(callee) && PASS_THROUGH.has(refOf(parsed, callee.text)?.name);
}

/** Routes held in a list of tiles or links (`{ route: '/words', label: … }`) that one call opens by its variable. */
function routeProperties(source) {
  const found = [];
  const visit = n => {
    if (ts.isPropertyAssignment(n) && ['route', 'href'].includes(n.name.getText())) {
      const value = ts.isAsExpression(n.initializer) ? n.initializer.expression : n.initializer;
      if ((ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) && routeLiteral(value.text)) found.push(value);
    }
    ts.forEachChild(n, visit);
  };
  visit(source);
  return found;
}

function refOf(parsed, name) {
  if (parsed.helpers.has(name)) return { file: parsed.file, name };
  return parsed.imports.get(name) ?? null;
}

export function extractLinks() {
  const files = walkFiles(SRC);
  const parsed = new Map(files.map(file => [file, parse(file)]));

  const memo = new Map();
  const helperRoutes = ({ file, name }) => {
    const key = `${file}#${name}`;
    if (memo.has(key)) return memo.get(key);
    memo.set(key, new Set());
    const p = parsed.get(file);
    const body = p?.helpers.get(name);
    if (!p || !body || PASS_THROUGH.has(name)) return memo.get(key);
    const routes = new Set();
    const visit = n => {
      if (ts.isCallExpression(n)) for (const route of callTargets(p, n, helperRoutes)) routes.add(route);
      ts.forEachChild(n, visit);
    };
    visit(body);
    if (routes.size) for (const route of routesIn(body, p.consts)) routes.add(route);
    memo.set(key, routes);
    return routes;
  };

  const passMemo = new Map();
  passesOn = ({ file, name }) => {
    const key = `${file}#${name}`;
    if (passMemo.has(key)) return passMemo.get(key);
    passMemo.set(key, -1);
    const p = parsed.get(file);
    const body = p?.helpers.get(name);
    if (!p || !body) return -1;
    const params = body.parameters.map(param => param.name.getText());
    let found = -1;
    const visit = n => {
      if (found === -1 && ts.isCallExpression(n) && n.arguments[0] && (isNavPrimitive(p, n) || (ts.isIdentifier(n.expression) && refOf(p, n.expression.text) && passesOn(refOf(p, n.expression.text)) === 0))) {
        const used = new Set();
        const collect = m => { if (ts.isIdentifier(m)) used.add(m.text); ts.forEachChild(m, collect); };
        collect(n.arguments[0]);
        found = params.findIndex(param => used.has(param));
      }
      ts.forEachChild(n, visit);
    };
    visit(body);
    passMemo.set(key, found);
    return found;
  };

  keyedPick = ({ file, name }, call) => {
    const p = parsed.get(file);
    const body = p?.helpers.get(name);
    const picked = new Set();
    if (!body) return picked;
    const maps = [];
    const visit = n => { if (ts.isIdentifier(n) && p.keyed.has(n.text)) maps.push(p.keyed.get(n.text)); ts.forEachChild(n, visit); };
    visit(body);
    const words = [];
    const collect = n => { if (ts.isStringLiteral(n)) words.push(n.text); ts.forEachChild(n, collect); };
    call.arguments.forEach(collect);
    for (const map of maps) for (const word of words) if (map.has(word)) picked.add(map.get(word));
    return picked;
  };

  const links = [];
  const sheets = [];
  for (const p of parsed.values()) {
    const visit = n => {
      const owner = topLevelOwner(n);
      const inHelper = isHelperName(owner) && p.helpers.has(owner);
      let routes = new Set();
      if (ts.isCallExpression(n)) routes = callTargets(p, n, helperRoutes);
      else if (ts.isIdentifier(n) && (ts.isJsxExpression(n.parent) || ts.isPropertyAssignment(n.parent) || (ts.isCallExpression(n.parent) && n.parent.arguments.includes(n)))) {
        const ref = refOf(p, n.text);
        if (ref && !PASS_THROUGH.has(ref.name) && isHelperName(ref.name)) routes = helperRoutes(ref);
      }
      if (!routes.size && !inHelper && ts.isCallExpression(n) && isNavPrimitive(p, n)) {
        for (const literal of routeProperties(p.source)) {
          const { line } = p.source.getLineAndCharacterOfPosition(literal.getStart());
          links.push({ file: rel(p.file), line: line + 1, owner: topLevelOwner(literal), label: labelNear(literal), route: routeLiteral(literal.text) });
        }
      }
      if (routes.size && !inHelper) {
        const { line } = p.source.getLineAndCharacterOfPosition(n.getStart());
        for (const route of routes) links.push({ file: rel(p.file), line: line + 1, owner, key: keyNear(n), label: labelNear(n), route });
        return;
      }
      if ((ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && /(Sheet|Menu)$/.test(n.tagName.getText()) && !['Sheet', 'Menu'].includes(n.tagName.getText())) {
        const { line } = p.source.getLineAndCharacterOfPosition(n.getStart());
        sheets.push({ file: rel(p.file), line: line + 1, owner, sheet: n.tagName.getText() });
      }
      ts.forEachChild(n, visit);
    };
    visit(p.source);
  }

  const reach = (file, name) => {
    const seen = new Set();
    const stack = [[file, name]];
    while (stack.length) {
      const [f, n] = stack.pop();
      const key = `${f}#${n}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const p = parsed.get(f);
      const node = n === '*' ? p?.source : p?.tops.get(n);
      if (!p || !node) continue;
      const visit = m => {
        if (ts.isIdentifier(m)) {
          if (p.tops.has(m.text) && m.text !== n) stack.push([f, m.text]);
          const ref = p.imports.get(m.text);
          if (ref) stack.push([ref.file, ref.name]);
        }
        if (ts.isCallExpression(m) && ts.isIdentifier(m.expression) && m.expression.text === 'require' && m.arguments[0] && ts.isStringLiteral(m.arguments[0])) {
          const target = resolveImport(f, m.arguments[0].text);
          if (target) stack.push([target, 'default']);
        }
        ts.forEachChild(m, visit);
      };
      visit(node);
    }
    return seen;
  };
  const everywhere = reach(path.join(APP, '_layout.tsx'), '*');
  const screens = new Map(files.filter(file => file.startsWith(APP) && !file.endsWith('_layout.tsx'))
    .map(file => [path.relative(APP, file).replace(/\.tsx$/, ''), reach(file, 'default')]));
  const symbol = item => `${path.join(SRC, item.file)}#${item.owner}`;
  for (const item of [...links, ...sheets]) {
    item.everywhere = everywhere.has(symbol(item));
    item.screens = [...screens].filter(([, seen]) => seen.has(symbol(item))).map(([screen]) => screen);
  }
  return { links, sheets };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { links, sheets } = extractLinks();
  for (const l of links) console.log(`${l.route}\t${l.file}:${l.line}\t${l.owner}\t${l.label ?? ''}\t${l.everywhere ? 'ALL' : l.screens.join(',')}`);
  for (const l of sheets) console.log(`SHEET ${l.sheet}\t${l.file}:${l.line}\t${l.owner}\t\t${l.everywhere ? 'ALL' : l.screens.join(',')}`);
}
