import { cn } from "@/common/lib/utils";
import { figureCaption, figureFrame, studyLabel } from "./study-styles";

const purchaseSteps = [
  { title: "상품 상세", body: "정비 상품 2개를 선택합니다." },
  { title: "장바구니·주문 제출", body: "선택한 수량을 구매 제한과 재고에 대조합니다." },
  { title: "결제 직전", body: "서버의 최신 재고로 다시 확인합니다." },
];

const card = "flex min-w-0 flex-col items-start rounded-sm border border-border bg-background p-[clamp(16px,2vw,24px)]";
const cardTitle = "mt-1 mb-2 text-[1.14rem] leading-[1.4] font-[680]";
const body = "leading-[1.65] text-body";
const outcome = "mt-auto w-full pt-4 leading-[1.65] text-foreground";
const cardGrid = "mt-3.5 grid grid-cols-1 gap-2.5 figure-wide:gap-3.5";

export function PurchaseSteps() {
  return (
    <figure className={cn(figureFrame, "bg-muted")}>
      <p className={studyLabel} lang="en">FIG. 01 / PURCHASE CHECKS</p>
      <ol className={cn(cardGrid, "figure-wide:grid-cols-3")} role="list">
        {purchaseSteps.map(({ title, body: description }, index) => (
          <li className={card} key={title}>
            <span className={studyLabel} aria-hidden="true">0{index + 1}</span>
            <h3 className={cardTitle}>{title}</h3>
            <p className={body}>{description}</p>
          </li>
        ))}
      </ol>
      <figcaption className={figureCaption}>정비 상품 2개를 주문하는 예시</figcaption>
    </figure>
  );
}

export function CheckoutBranches() {
  return (
    <figure className={cn(figureFrame, "bg-muted")}>
      <p className={studyLabel} lang="en">FIG. 02 / CHECKOUT BRANCH</p>
      <ol className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 font-[650]" aria-label="공통 결제 단계" role="list">
        <li>선주문</li>
        <li><span className="text-[#576370]" aria-hidden="true">→</span> 결제창</li>
        <li><span className="text-[#576370]" aria-hidden="true">→</span> 가격·수량 재검증</li>
      </ol>
      <ul className={cn(cardGrid, "figure-wide:grid-cols-2")} role="list">
        <li className={cn(card, "border-t-[3px] border-t-ring")}>
          <span className={studyLabel} lang="en">A / PASS</span>
          <h3 className={cardTitle}>검증 통과</h3>
          <p className={body}>가격과 구매 조건이 그대로이고, 재고가 2개 이상 남았습니다.</p>
          <p className={outcome}>결제 승인 성공 <span aria-hidden="true">→</span> <strong className="font-bold">주문 확정</strong></p>
        </li>
        <li className={cn(card, "border-t-[3px] border-t-[#575f6e]")}>
          <span className={cn(studyLabel, "text-[#444d59]")} lang="en">B / STOP</span>
          <h3 className={cardTitle}>검증 실패</h3>
          <p className={body}>요청한 수량은 2개인데, 재고가 1개만 남았습니다.</p>
          <p className={outcome}>승인 중단 <span aria-hidden="true">→</span> <strong className="font-bold">선주문 취소 요청</strong> <span aria-hidden="true">→</span> 사용자 안내</p>
        </li>
      </ul>
      <figcaption className={figureCaption}>같은 선주문에서 재검증 결과에 따라 달라지는 두 경로</figcaption>
    </figure>
  );
}
