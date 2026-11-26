import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases } from "@/common/data/cases";
import { CaseScreen } from "./_components/case-screen";
import { introductions } from "./_content/introductions";

type Props = PageProps<"/work/[slug]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map(({ slug }) => ({ slug }));
}

async function readCase(params: Props["params"]) {
  const { slug } = await params;
  const index = cases.findIndex((item) => item.slug === slug);
  const item = cases[index];
  if (!item) notFound();
  return { item, intro: introductions[item.slug], nextCase: cases.at(index + 1) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item, intro } = await readCase(params);
  return { title: `${item.title} | 오하민 포트폴리오`, description: intro.summary };
}

export default async function CasePage({ params }: Props) {
  const { item, intro, nextCase } = await readCase(params);
  return <CaseScreen item={item} intro={intro} nextCase={nextCase} />;
}
