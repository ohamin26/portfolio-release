import s from "./payment.module.css";

const purchaseSteps = [
  { title: "상품 상세", body: "정비 상품 2개를 선택합니다." },
  { title: "장바구니·주문 제출", body: "선택한 수량을 구매 제한과 재고에 대조합니다." },
  { title: "결제 직전", body: "서버의 최신 재고로 다시 확인합니다." },
];

export function PurchaseSteps() {
  return (
    <figure className={s.figure}>
      <p className={s.tag} lang="en">FIG. 01 / PURCHASE CHECKS</p>
      <ol className={s.steps} role="list">
        {purchaseSteps.map(({ title, body }, index) => (
          <li className={s.card} key={title}>
            <span className={s.tag} aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3><p>{body}</p>
          </li>
        ))}
      </ol>
      <figcaption>정비 상품 2개를 주문하는 예시</figcaption>
    </figure>
  );
}

export function CheckoutBranches() {
  return (
    <figure className={s.figure}>
      <p className={s.tag} lang="en">FIG. 02 / CHECKOUT BRANCH</p>
      <ol className={s.path} aria-label="공통 결제 단계" role="list">
        <li>선주문</li>
        <li><span aria-hidden="true">→</span> 결제창</li>
        <li><span aria-hidden="true">→</span> 가격·수량 재검증</li>
      </ol>
      <ul className={s.branches} role="list">
        <li className={s.card}>
          <span className={s.tag} lang="en">A / PASS</span>
          <h3>검증 통과</h3>
          <p>가격과 구매 조건이 그대로이고, 재고가 2개 이상 남았습니다.</p>
          <p className={s.outcome}>결제 승인 성공 <span aria-hidden="true">→</span> <strong>주문 확정</strong></p>
        </li>
        <li className={s.card}>
          <span className={s.tag} lang="en">B / STOP</span>
          <h3>검증 실패</h3>
          <p>요청한 수량은 2개인데, 재고가 1개만 남았습니다.</p>
          <p className={s.outcome}>승인 중단 <span aria-hidden="true">→</span> <strong>선주문 취소 요청</strong> <span aria-hidden="true">→</span> 사용자 안내</p>
        </li>
      </ul>
      <figcaption>같은 선주문에서 재검증 결과에 따라 달라지는 두 경로</figcaption>
    </figure>
  );
}
