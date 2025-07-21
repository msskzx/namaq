import type { Person as PrismaPerson, Title as PrismaTitle } from "@/generated/prisma";

export interface Ayah {
  surah: number;
  ayah: number;
  text?: string;
}

export type Person = PrismaPerson & {
  titles: PrismaTitle[];
  ayat?: Ayah[];
}; 