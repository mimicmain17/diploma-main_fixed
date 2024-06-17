"use client";
import {
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { columns } from "./Problems";
import { useEffect, useState } from "react";

const Problem = ({ row }: { row: any }) => {
  return (
    <div className="flex flex-col gap-y-2 px-2">
      <Table aria-label="problem">
        <TableHeader columns={columns.slice(1, -1)}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {row && (
            <TableRow key="1">
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.theme}</TableCell>
              <TableCell>{row.created_at}</TableCell>
              <TableCell>{row.deadline}</TableCell>
              <TableCell>{row.teacher}</TableCell>
              <TableCell>
                <Link href={row.file} download={row.file}>
                  {row.file}
                </Link>
              </TableCell>
              <TableCell>{row.comment}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Problem;
