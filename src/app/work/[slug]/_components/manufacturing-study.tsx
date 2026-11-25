import type { TabTiming } from "@/common/data/tab-timing";
import { DeviceComparison, TabComparison } from "./manufacturing-figures";
import { StudyChapter } from "./study-chapter";
import { studyCopy } from "./study-styles";

export function ManufacturingStudy({ timing }: { timing: TabTiming | null }) {
  return (
    <>
      <StudyChapter id="architecture-title" label="01 / ARCHITECTURE" title="같은 업무 로직, 기기에 맞는 화면">
        <p className={studyCopy}>
          설비 수리 화면을 태블릿에서도 쓸 수 있도록 구조를 다시 설계했습니다.
          수리 목록을 불러오고 선택한 건을 처리하는 로직은 함께 쓰되, 목록을 보여주고 조작하는 방식은 데스크톱과 터치 화면에 맞게 나눴습니다.
        </p>
        <DeviceComparison />
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
