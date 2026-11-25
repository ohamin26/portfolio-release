import { cn } from "@/common/lib/utils";
import { figureCaption, figureFrame, studyLabel } from "./study-styles";

const purchaseSteps = [
  { title: "상품 상세", body: "상품별 구매 제한과 재고 관리 여부에 따라 선택할 수 있는 수량을 정합니다." },
  { title: "장바구니에서 주문할 때", body: "장바구니를 다시 조회합니다. 구매 가능 수량이 달라졌다면 목록을 갱신하고 주문을 멈춥니다." },
  { title: "결제 승인 직전", body: "주문 정보로 수량을 확인한 뒤, 서버에 주문 가격 검증을 요청합니다." },
];

const checkoutBranches = [
  {
    title: "승인 전 검증 실패",
    body: "주문 수량이 한도를 넘거나 가격 검증에 실패하면 결제 승인을 요청하지 않습니다.",
    outcome: "선주문 취소 요청",
  },
  {
    title: "승인 후 주문 완료 성공",
    body: "결제 영수증을 담아 주문 완료를 요청합니다. 이 요청이 성공해야 주문 완료 화면으로 이동합니다.",
    outcome: "주문 확정",
  },
  {
    title: "승인 후 주문 완료 실패",
    body: "결제는 승인됐지만 주문 완료 요청에서 오류가 발생했습니다. 주문 완료 화면으로 이동하지 않습니다.",
    outcome: "주문 완료 처리 오류 안내",
  },
];

const card = "flex min-w-0 flex-col items-start rounded-sm border border-border bg-background p-[clamp(16px,2vw,24px)]";
const cardTitle = "mt-1 mb-2 text-[1.14rem] leading-[1.4] font-[680]";
const body = "leading-[1.65] text-body";
const cardGrid = "mt-3.5 grid grid-cols-1 gap-2.5 figure-wide:grid-cols-3 figure-wide:gap-3.5";

export function PurchaseSteps() {
  return (
    <figure className={cn(figureFrame, "bg-muted")}>
      <p className={studyLabel} lang="en">FIG. 01 / PURCHASE CHECKS</p>
      <ol className={cardGrid} role="list">
        {purchaseSteps.map(({ title, body: description }, index) => (
          <li className={card} key={title}>
            <span className={studyLabel} aria-hidden="true">0{index + 1}</span>
            <h3 className={cardTitle}>{title}</h3>
            <p className={body}>{description}</p>
          </li>
        ))}
      </ol>
      <figcaption className={figureCaption}>사용자 웹에서 주문 단계별로 확인하는 구매 조건</figcaption>
    </figure>
  );
}

export function CheckoutBranches() {
  return (
    <figure className={cn(figureFrame, "bg-muted")}>
      <p className={studyLabel} lang="en">FIG. 02 / CHECKOUT</p>
      <ol className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 font-[650]" aria-label="공통 결제 단계" role="list">
        <li>선주문</li>
        <li><span aria-hidden="true">→</span> 결제창</li>
        <li><span aria-hidden="true">→</span> 승인 전 수량·가격 검증</li>
      </ol>
      <ul className={cardGrid} role="list">
        {checkoutBranches.map(({ title, body: description, outcome }) => (
          <li className={cn(card, "border-t-[3px] border-t-ring")} key={title}>
            <h3 className={cardTitle}>{title}</h3>
            <p className={body}>{description}</p>
            <strong className="mt-auto pt-4 font-bold">{outcome}</strong>
          </li>
        ))}
      </ul>
      <figcaption className={figureCaption}>카드 결제 승인 전후, 주문을 처리하는 세 가지 경로</figcaption>
    </figure>
  );
}
