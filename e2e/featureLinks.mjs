// See docs/feature-map.md, "How the links are found".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const APP_SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), '../mobile/src');
const ROUTER_METHODS = new Set(['push', 'navigate', 'replace', 'dismissTo']);
const PASS_THROUGH = new Set(['toTab']);
const LABEL_PROPS = ['accessibilityLabel', 'label', 'aria-label', 'title', 'name'];
const OWN_LABEL_PROPS = ['accessibilityLabel', 'label', 'aria-label'];

const posix = file => file.split(path.sep).join('/');

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(file);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [file] : [];
  });
}

function resolveImport(src, from, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(src, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const ending of ['', '.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const file = base + ending;
    if (fs.existsSync(file) && fs.statSync(file).isFile() && file.startsWith(src)) return file;
  }
  return null;
}

const routeLiteral = text => (/^\/[a-z[(]/.test(text) || text === '/' ? text.split('?')[0] : null);
const isText = n => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n);

function routesIn(node, consts) {
  const found = new Set();
  const visit = n => {
    if (isText(n)) {
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
  if (isText(expr)) return expr.text;
  if (ts.isJsxExpression(expr)) return textOf(expr.expression);
  if (ts.isTemplateExpression(expr)) return expr.head.text + expr.templateSpans.map(span => `‹›${span.literal.text}`).join('');
  if (ts.isConditionalExpression(expr)) return textOf(expr.whenFalse) ?? textOf(expr.whenTrue);
  if (ts.isParenthesizedExpression(expr)) return textOf(expr.expression);
  return null;
}

const attrText = (element, names) => {
  for (const name of names) {
    const attr = element.attributes.properties.find(prop => ts.isJsxAttribute(prop) && prop.name.getText() === name);
    const text = attr && textOf(attr.initializer);
    if (text) return text;
  }
  return null;
};

function labelNear(node) {
  if (ts.isCallExpression(node)) {
    const words = node.arguments.map(textOf).filter(text => text && !routeLiteral(text));
    if (words.length) return words[0];
  }
  for (let n = node.parent; n; n = n.parent) {
    if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && ts.isVariableDeclaration(n.parent)) return usedLabel(n.parent);
    if (ts.isPropertyAssignment(n) && ts.isObjectLiteralExpression(n.parent) && !n.parent.properties.some(p => ts.isPropertyAssignment(p) && ['label', 'title', 'name'].includes(p.name.getText()))) return null;
    if (ts.isJsxAttribute(n)) {
      const element = n.parent.parent;
      return attrText(element, OWN_LABEL_PROPS) ?? (ts.isJsxOpeningElement(element) ? childText(element.parent) : null);
    }
    if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) return attrText(n, LABEL_PROPS);
    if (ts.isJsxElement(n)) return childText(n);
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

function childText(element) {
  const text = element.children.map(child => (ts.isJsxText(child) ? child.text : textOf(child) ?? '')).join('').trim();
  return text || null;
}

function usedLabel(declaration) {
  const name = declaration.name.getText();
  let scope = declaration.parent;
  while (scope && !ts.isBlock(scope) && !ts.isSourceFile(scope)) scope = scope.parent;
  let found = null;
  const visit = n => {
    if (found) return;
    if (ts.isIdentifier(n) && n.text === name && n !== declaration.name && ts.isJsxExpression(n.parent) && ts.isJsxAttribute(n.parent.parent)) {
      const element = n.parent.parent.parent.parent;
      found = attrText(element, OWN_LABEL_PROPS) ?? (ts.isJsxOpeningElement(element) ? childText(element.parent) : null);
    }
    ts.forEachChild(n, visit);
  };
  if (scope) visit(scope);
  return found;
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

function parse(src, file) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const imports = new Map();
  const consts = new Map();
  const keyed = new Map();
  const helpers = new Map();
  const tops = new Map();
  const aliases = new Map();
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const target = resolveImport(src, file, statement.moduleSpecifier.text);
      if (!target) continue;
      const names = statement.importClause?.namedBindings;
      if (names && ts.isNamedImports(names)) for (const el of names.elements) imports.set(el.name.text, { file: target, name: (el.propertyName ?? el.name).text });
      if (statement.importClause?.name) imports.set(statement.importClause.name.text, { file: target, name: 'default' });
    } else if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      const target = statement.moduleSpecifier && resolveImport(src, file, statement.moduleSpecifier.text);
      for (const el of statement.exportClause.elements) {
        const from = (el.propertyName ?? el.name).text;
        if (target) aliases.set(el.name.text, { file: target, name: from });
        else if (from !== el.name.text) aliases.set(el.name.text, { file, name: from });
      }
    } else if (ts.isVariableStatement(statement)) {
      for (const decl of statement.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
        if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) helpers.set(decl.name.text, decl.initializer);
        else {
          consts.set(decl.name.text, routesIn(decl.initializer));
          if (ts.isObjectLiteralExpression(decl.initializer)) {
            const byKey = new Map();
            for (const prop of decl.initializer.properties) {
              const route = ts.isPropertyAssignment(prop) && isText(prop.initializer) && routeLiteral(prop.initializer.text);
              if (route) byKey.set(prop.name.getText().replace(/['"]/g, ''), route);
            }
            if (byKey.size) keyed.set(decl.name.text, byKey);
          }
        }
      }
    } else if (ts.isFunctionDeclaration(statement) && statement.name) helpers.set(statement.name.text, statement);
    const names = ts.isFunctionDeclaration(statement) ? [statement.name?.text ?? 'default']
      : ts.isVariableStatement(statement) ? statement.declarationList.declarations.map(decl => decl.name.getText())
      : ts.isExportAssignment(statement) ? ['default'] : [];
    const isDefault = ts.isFunctionDeclaration(statement) && statement.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);
    for (const name of isDefault && statement.name ? [statement.name.text, 'default'] : names) tops.set(name, statement);
  }
  return { file, source, imports, consts, keyed, helpers, tops, aliases };
}

const addAll = (into, routes) => {
  for (const [route, kinds] of routes) {
    if (!into.has(route)) into.set(route, new Set());
    for (const kind of kinds) into.get(route).add(kind);
  }
  return into;
};
const withKinds = (routes, kinds) => new Map([...routes].map(route => [route, new Set(kinds)]));

/** Links in the phone app's code (or another tree laid out like it): every place that opens a screen, and every sheet and menu. */
export function extractLinks(src = APP_SRC) {
  const app = path.join(src, 'app');
  const rel = file => posix(path.relative(src, file));
  const files = walkFiles(src).sort();
  const parsed = new Map(files.map(file => [file, parse(src, file)]));
  const refOf = (p, name) => (p.helpers.has(name) ? { file: p.file, name } : p.imports.get(name) ?? null);
  const routerMethod = call => ts.isPropertyAccessExpression(call.expression) && call.expression.expression.getText() === 'router' && ROUTER_METHODS.has(call.expression.name.text)
    ? call.expression.name.text : null;
  const isPassThrough = (p, call) => ts.isIdentifier(call.expression) && PASS_THROUGH.has(refOf(p, call.expression.text)?.name);
  const isNavPrimitive = (p, call) => !!routerMethod(call) || isPassThrough(p, call);
  const primitiveKind = (p, call) => (isPassThrough(p, call) ? 'tab' : routerMethod(call));

  const memo = new Map();
  const passMemo = new Map();

  const passesOn = ({ file, name }) => {
    const key = `${file}#${name}`;
    if (passMemo.has(key)) return passMemo.get(key);
    passMemo.set(key, { at: -1, kinds: new Set() });
    const p = parsed.get(file);
    const body = p?.helpers.get(name);
    if (!p || !body) return passMemo.get(key);
    const params = body.parameters.map(param => param.name.getText());
    let found = { at: -1, kinds: new Set() };
    const visit = n => {
      if (found.at === -1 && ts.isCallExpression(n) && n.arguments[0]) {
        const inner = ts.isIdentifier(n.expression) && refOf(p, n.expression.text);
        const onward = inner && !isNavPrimitive(p, n) ? passesOn(inner) : null;
        if (isNavPrimitive(p, n) || onward?.at === 0) {
          const used = new Set();
          const collect = m => { if (ts.isIdentifier(m)) used.add(m.text); ts.forEachChild(m, collect); };
          collect(n.arguments[0]);
          const at = params.findIndex(param => used.has(param));
          if (at !== -1) found = { at, kinds: onward ? onward.kinds : new Set([primitiveKind(p, n)]) };
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(body);
    passMemo.set(key, found);
    return found;
  };

  const keyedPick = ({ file, name }, call) => {
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

  const helperRoutes = ref => {
    const key = `${ref.file}#${ref.name}`;
    if (memo.has(key)) return memo.get(key);
    memo.set(key, new Map());
    const p = parsed.get(ref.file);
    const body = p?.helpers.get(ref.name);
    if (!p || !body || PASS_THROUGH.has(ref.name)) return memo.get(key);
    const routes = new Map();
    const visit = n => {
      if (ts.isCallExpression(n)) addAll(routes, callTargets(p, n));
      else if (ts.isIdentifier(n) && ts.isCallExpression(n.parent) && n.parent.arguments.includes(n) && refOf(p, n.text) && isHelperName(n.text)) addAll(routes, helperRoutes(refOf(p, n.text)));
      ts.forEachChild(n, visit);
    };
    visit(body);
    if (routes.size) {
      const kinds = new Set([...routes.values()].flatMap(set => [...set]));
      for (const route of routesIn(body, p.consts)) if (!routes.has(route)) routes.set(route, new Set(kinds));
    }
    memo.set(key, routes);
    return routes;
  };

  const callTargets = (p, call) => {
    if (isNavPrimitive(p, call)) return withKinds(routesIn(call.arguments[0] ?? call, p.consts), [primitiveKind(p, call)]);
    const ref = ts.isIdentifier(call.expression) ? refOf(p, call.expression.text) : null;
    if (!ref) return new Map();
    let routes = new Map(helperRoutes(ref));
    const picked = keyedPick(ref, call);
    if (picked.size) routes = new Map([...routes].filter(([route]) => picked.has(route)));
    const pass = passesOn(ref);
    if (pass.at !== -1 && call.arguments[pass.at]) addAll(routes, withKinds(routesIn(call.arguments[pass.at], p.consts), pass.kinds));
    return routes;
  };

  const routeProperties = source => {
    const found = [];
    const visit = n => {
      if (ts.isPropertyAssignment(n) && ['route', 'href'].includes(n.name.getText())) {
        const value = ts.isAsExpression(n.initializer) ? n.initializer.expression : n.initializer;
        if (isText(value) && routeLiteral(value.text)) found.push(value);
      }
      ts.forEachChild(n, visit);
    };
    visit(source);
    return found;
  };

  const links = [];
  const sheets = [];
  const lineOf = (p, n) => p.source.getLineAndCharacterOfPosition(n.getStart()).line + 1;
  for (const p of parsed.values()) {
    const visit = n => {
      const owner = topLevelOwner(n);
      const inHelper = isHelperName(owner) && p.helpers.has(owner);
      let routes = new Map();
      if (ts.isCallExpression(n)) routes = callTargets(p, n);
      else if (ts.isIdentifier(n) && (ts.isJsxExpression(n.parent) || ts.isPropertyAssignment(n.parent) || (ts.isCallExpression(n.parent) && n.parent.arguments.includes(n)))) {
        const ref = refOf(p, n.text);
        if (ref && !PASS_THROUGH.has(ref.name) && isHelperName(ref.name)) routes = helperRoutes(ref);
      }
      if (!routes.size && !inHelper && ts.isCallExpression(n) && isNavPrimitive(p, n)) {
        for (const literal of routeProperties(p.source)) {
          links.push({ file: rel(p.file), line: lineOf(p, literal), owner: topLevelOwner(literal), key: null, label: labelNear(literal), route: routeLiteral(literal.text), how: primitiveKind(p, n) });
        }
      }
      if (routes.size && !inHelper) {
        for (const [route, kinds] of routes) links.push({ file: rel(p.file), line: lineOf(p, n), owner, key: keyNear(n), label: labelNear(n), route, how: [...kinds].sort().join('+') });
        return;
      }
      if ((ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && /(Sheet|Menu)$/.test(n.tagName.getText()) && !['Sheet', 'Menu'].includes(n.tagName.getText())) {
        sheets.push({ file: rel(p.file), line: lineOf(p, n), owner, sheet: n.tagName.getText(), label: attrText(n, ['label']) });
      }
      ts.forEachChild(n, visit);
    };
    visit(p.source);
  }

  const reach = (start, into = new Set()) => {
    const stack = [...start];
    while (stack.length) {
      const [f, n] = stack.pop();
      const key = `${f}#${n}`;
      if (into.has(key)) continue;
      into.add(key);
      const p = parsed.get(f);
      if (!p) continue;
      if (p.aliases.has(n)) { const alias = p.aliases.get(n); stack.push([alias.file, alias.name]); continue; }
      const node = n === '*' ? p.source : p.tops.get(n);
      if (!node) continue;
      const visit = m => {
        if (ts.isIdentifier(m)) {
          if (p.tops.has(m.text) && m.text !== n) stack.push([f, m.text]);
          if (p.aliases.has(m.text)) stack.push([f, m.text]);
          const ref = p.imports.get(m.text);
          if (ref) stack.push([ref.file, ref.name]);
        }
        if (ts.isCallExpression(m) && ts.isIdentifier(m.expression) && m.expression.text === 'require' && m.arguments[0] && ts.isStringLiteral(m.arguments[0])) {
          const target = resolveImport(src, f, m.arguments[0].text);
          if (target) stack.push([target, 'default']);
        }
        ts.forEachChild(m, visit);
      };
      visit(node);
    }
    return into;
  };
  const routeFiles = files.filter(file => file.startsWith(app) && !file.endsWith('_layout.tsx'));
  const everywhere = reach([
    ...files.filter(file => file.startsWith(app) && file.endsWith('_layout.tsx')).map(file => [file, '*']),
    ...routeFiles.filter(file => parsed.get(file).aliases.has('ErrorBoundary')).map(file => [file, 'ErrorBoundary']),
  ]);
  const screens = new Map(routeFiles.map(file => [posix(path.relative(app, file)).replace(/\.tsx$/, ''), reach([[file, 'default']])]));
  const symbol = item => `${path.join(src, item.file)}#${item.owner}`;
  for (const item of [...links, ...sheets]) {
    item.everywhere = everywhere.has(symbol(item));
    item.screens = [...screens].filter(([, seen]) => seen.has(symbol(item))).map(([screen]) => screen);
  }
  const uses = (screen, file, name) => screens.get(screen)?.has(`${path.join(src, file)}#${name}`) ?? false;
  return { links, sheets, uses };
}
