import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { drawingElements, readoutKeyword, sources } from "../_content/scada-example";

export function ScadaSettings() {
  return (
    <Table>
      <TableCaption>도면 요소별 연결 설정</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">도면 요소</TableHead>
          <TableHead scope="col">키워드</TableHead>
          <TableHead scope="col">데이터 소스</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drawingElements.map((element) => (
          <TableRow key={element.id}>
            <TableCell>{element.label}</TableCell>
            <TableCell>{readoutKeyword}</TableCell>
            <TableCell>{sources[element.bindings[readoutKeyword]].label}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
