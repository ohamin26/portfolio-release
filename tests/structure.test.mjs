import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { ESLint } from "eslint";

test("라우트는 루트가 아닌 src/app에서만 시작한다", () => {
  assert.ok(existsSync("src/app"));
  for (const path of ["app", "pages", "src/pages"]) {
    assert.equal(existsSync(path), false, `경쟁하는 라우트 경로: ${path}`);
  }
});

test("공용 모듈은 별칭이나 상대 경로로 화면을 가져올 수 없다", async () => {
  const eslint = new ESLint();
  const check = async (specifier) => {
    const [report] = await eslint.lintText(`export { example } from "${specifier}";`, {
      filePath: "src/common/components/example.ts",
    });
    return report.messages.map(({ ruleId }) => ruleId);
  };
  assert.deepEqual(await check("@/common/lib/example"), []);
  for (const path of ["@/app/_components/example", "../../app/_components/example"]) {
    assert.deepEqual(await check(path), ["no-restricted-imports"]);
  }
});
