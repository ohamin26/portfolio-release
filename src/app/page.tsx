import { homeCard, shareMetadata } from "@/common/lib/share-metadata";
import { HomeScreen } from "./_components/home-screen";

export const metadata = shareMetadata(
  homeCard,
  "제조 현장의 터치 화면부터 자동차 정비 서비스의 결제 경험까지, 오하민의 프론트엔드 작업을 소개합니다.",
);

export default function HomePage() {
  return <HomeScreen />;
}
