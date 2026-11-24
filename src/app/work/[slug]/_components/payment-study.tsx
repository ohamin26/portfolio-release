import { CheckoutBranches, PurchaseSteps } from "./payment-figures";
import { StudyChapter } from "./study-chapter";
import { studyCopy } from "./study-styles";

export function PaymentStudy() {
  return (
    <>
      <StudyChapter id="purchase-policy-title" label="01 / PURCHASE POLICY" title="장바구니와 결제창의 구매 기준을 맞췄습니다">
        <p className={studyCopy}>
          상품을 담을 때는 재고가 충분해도 결제할 때는 부족할 수 있습니다.
          화면마다 허용 수량이 달라지지 않도록 상품별 구매 제한과 재고를 함께 확인하는 규칙을 만들었습니다.
          주문을 제출할 때도 같은 규칙을 쓰고, 결제 직전에는 서버의 최신 재고로 다시 확인했습니다.
        </p>
        <PurchaseSteps />
      </StudyChapter>
      <StudyChapter id="checkout-flow-title" label="02 / PAYMENT FLOW" title="결제창에서 돌아왔다고 주문을 확정하지는 않습니다">
        <p className={studyCopy}>
          선주문을 만드는 시점과 주문을 확정하는 시점을 분리했습니다.
          결제창에서 돌아오면 가격과 수량을 다시 확인하고, 검증을 통과한 주문만 결제 승인 단계로 보냈습니다.
        </p>
        <CheckoutBranches />
        <p className={`mt-5 ${studyCopy}`}>
          사용자가 결제를 취소한 경우에도 선주문 취소를 요청한 뒤 다음 행동을 안내했습니다.
        </p>
      </StudyChapter>
    </>
  );
}
