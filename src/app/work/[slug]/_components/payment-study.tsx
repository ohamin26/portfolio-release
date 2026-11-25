import { CheckoutBranches, PurchaseSteps } from "./payment-figures";
import { StudyChapter } from "./study-chapter";
import { studyCopy } from "./study-styles";

export function PaymentStudy() {
  return (
    <>
      <StudyChapter id="purchase-policy-title" label="01 / PURCHASE POLICY" title="담을 때와 주문할 때, 살 수 있는 수량이 달라진다면">
        <p className={studyCopy}>
          상품을 담은 뒤 재고가 줄어들 수 있습니다. 사용자 웹에서는 장바구니에서 주문을 시작할 때
          목록을 다시 받아, 선택한 상품을 여전히 같은 수량만큼 살 수 있는지 비교했습니다.
          구매 가능 수량이 달라졌다면 결제창을 열기 전에 바뀐 수량을 확인하도록 했습니다.
        </p>
        <PurchaseSteps />
      </StudyChapter>
      <StudyChapter id="checkout-flow-title" label="02 / PAYMENT FLOW" title="결제 승인과 주문 확정은 다른 단계입니다">
        <p className={studyCopy}>
          결제창을 열기 전에 선주문을 만들고, 카드 결제가 승인된 뒤에 주문 완료를 별도로 요청했습니다.
          승인 전에는 무엇이 결제를 막았는지, 승인 후에는 주문까지 완료됐는지를 기준으로 화면의 다음 동작을 나눴습니다.
        </p>
        <CheckoutBranches />
        <p className={`mt-5 ${studyCopy}`}>
          사용자가 결제창에서 취소한 경우에도 선주문 취소를 요청합니다.
          취소 요청 자체가 실패하면 별도로 안내합니다.
        </p>
      </StudyChapter>
    </>
  );
}
