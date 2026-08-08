import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";

describe("Table", () => {
  it("renders headers, rows, and cells", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Amaka Obi</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Amaka Obi" })).toBeInTheDocument();
  });

  it("calls onClick when a row with a handler is clicked", () => {
    const onClick = vi.fn();
    render(
      <Table>
        <TableBody>
          <TableRow onClick={onClick}>
            <TableCell>Amaka Obi</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    fireEvent.click(screen.getByRole("cell", { name: "Amaka Obi" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not treat a row without an onClick as interactive", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Amaka Obi</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("row", { name: "Amaka Obi" }).className).not.toContain("cursor-pointer");
  });

  it("lets a cell stop a click from reaching the row handler", () => {
    const onRowClick = vi.fn();
    const onCellClick = vi.fn((e: React.MouseEvent) => e.stopPropagation());
    render(
      <Table>
        <TableBody>
          <TableRow onClick={onRowClick}>
            <TableCell>Amaka Obi</TableCell>
            <TableCell onClick={onCellClick}>Actions</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    fireEvent.click(screen.getByRole("cell", { name: "Actions" }));
    expect(onCellClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
