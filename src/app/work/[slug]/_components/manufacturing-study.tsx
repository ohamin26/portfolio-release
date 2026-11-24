import type { TabTiming } from "@/common/data/tab-timing";
import { DeviceComparison, TabComparison } from "./manufacturing-figures";
import { StudyChapter } from "./study-chapter";
import { studyCopy } from "./study-styles";

export function ManufacturingStudy({ timing }: { timing: TabTiming | null }) {
  return (
    <>
      <StudyChapter id="architecture-title" label="01 / ARCHITECTURE" title="같은 검증 규칙, 서로 다른 입력 화면">
        <p className={studyCopy}>
          데스크톱 표와 현장 터치 화면은 같은 자재를 다루지만 조작 방식은 다릅니다.
          기기별 화면이 서로를 참조해 한쪽을 수정할 때 다른 쪽까지 살펴야 했습니다.
          상태와 수량 검증은 업무 단위로 모으고, 마우스와 터치 입력은 각 화면에 남겼습니다.
        </p>
        <DeviceComparison />
        <p className={`mt-5 ${studyCopy}`}>
          이 구조를 자재 불출과 공정 실적 등 제조 업무에 적용했습니다.
          수량 검증은 공통 규칙으로, 기기별 입력 동작은 각 화면의 회귀 테스트로 확인했습니다.
        </p>
      </StudyChapter>
      <StudyChapter id="performance-title" label="02 / PERFORMANCE" title="입력은 남기고, 숨은 탭 렌더링은 줄이고">
        <p className={studyCopy}>
          탭을 바꿨다가 돌아와도 입력값과 선택 상태가 남아야 했습니다.
          탭 전환 때 부모의 렌더링이 비활성 탭 본문까지 이어지던 구조를 분리하고,
          각 탭은 자기 제목과 활성 여부만 구독하도록 바꿨습니다.
        </p>
        {timing && <TabComparison timing={timing} />}
      </StudyChapter>
    </>
  );
}
