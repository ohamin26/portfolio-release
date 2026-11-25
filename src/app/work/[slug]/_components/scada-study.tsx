import { ScadaExplorer } from "./scada-explorer";
import { ScadaSettings } from "./scada-settings";
import { StudyChapter } from "./study-chapter";
import { studyCopy } from "./study-styles";

export function ScadaStudy() {
  return (
    <StudyChapter id="scada-study-title" label="01 / LINKED VIEWS" title="도면과 차트가 같은 지점을 바라보도록">
      <p className={studyCopy}>
        도면의 도형이나 표의 셀에는 키워드와 데이터 소스를 연결할 수 있습니다.
        저는 도면 뷰어에서 선택한 요소의 연결 정보를 Angular의 공통 이벤트 서비스로 전달하도록 구현했습니다.
        대시보드의 차트와 표는 이 이벤트를 받아 조회할 데이터를 바꿉니다.
      </p>
      <ScadaExplorer settings={<ScadaSettings />} />
    </StudyChapter>
  );
}
