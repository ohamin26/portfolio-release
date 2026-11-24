import { EquipmentExplorer } from "./equipment-explorer";
import s from "./study.module.css";

export function EquipmentStudy() {
  return (
    <section className={s.chapter} aria-labelledby="equipment-study-title">
      <p className={s.label} lang="en">01 / LINKED VIEWS</p>
      <h2 id="equipment-study-title">차트에서 고른 설비를 표에서 다시 찾지 않도록</h2>
      <p className={s.copy}>
        차트는 선택한 설비를 보여주는데 표는 여전히 전체 설비를 보여준다면, 두 화면의 수치를 바로 비교할 수 없습니다.
        Angular의 공통 이벤트 서비스로 선택한 설비를 전달하고, 연관 차트와 표는 RxJS로 그 값을 받아 다음 조회의 조건으로 쓰도록 했습니다.
      </p>
      <EquipmentExplorer />
    </section>
  );
}
