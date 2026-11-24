"use client";

import { useState } from "react";
import s from "./equipment.module.css";

const equipment = ["설비 A", "설비 B"] as const;
const scopes = ["전체 설비", ...equipment] as const;
type Scope = (typeof scopes)[number];

const samples = [
  { time: "09:00", counts: { "설비 A": 12, "설비 B": 8 } },
  { time: "10:00", counts: { "설비 A": 18, "설비 B": 7 } },
] as const;
const axisMax = 30;

export function EquipmentExplorer() {
  const [scope, setScope] = useState<Scope>("전체 설비");
  const visibleEquipment = equipment.filter((name) => scope === "전체 설비" || name === scope);

  return (
    <div className={s.explorer}>
      <p className={s.kicker}>예시 데이터</p>
      <fieldset className={s.picker}>
        <legend>설비 선택</legend>
        <p>전체 합계를 살펴본 뒤, 설비 하나를 골라 차트와 표를 비교해 보세요.</p>
        <div className={s.options}>
          {scopes.map((name) => (
            <label key={name}>
              <input type="radio" name="equipment-scope" checked={scope === name} onChange={() => setScope(name)} />
              {name}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="sr-only" role="status">{scope} 기준으로 차트와 표를 표시합니다.</p>
      <div className={s.results}>
        <figure className={s.card}>
          <figcaption>{scope} · 시간대별 수집 건수</figcaption>
          <dl className={s.plot}>
            {samples.map(({ time, counts }) => {
              const total = visibleEquipment.reduce((sum, name) => sum + counts[name], 0);
              return (
                <div key={time}>
                  <dt>{time}</dt>
                  <dd>
                    <span className={s.track} aria-hidden="true"><span style={{ width: `${total / axisMax * 100}%` }} /></span>
                    {total}건
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className={s.scale}>차트 눈금: 0–{axisMax}건</p>
        </figure>
        <div className={s.card}>
          <table className={s.table}>
            <caption>{scope} · 수집 내역</caption>
            <thead><tr><th scope="col">시간</th><th scope="col">설비</th><th scope="col">수집 건수</th></tr></thead>
            <tbody>
              {samples.flatMap(({ time, counts }) => visibleEquipment.map((name) => (
                <tr key={`${time}-${name}`}><td>{time}</td><td>{name}</td><td>{counts[name]}건</td></tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
