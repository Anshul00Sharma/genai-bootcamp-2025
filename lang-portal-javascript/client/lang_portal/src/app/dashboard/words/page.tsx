"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Word {
  id: number;
  german: string;
  phonetics: string;
  english: string;
  parts: {
    type: string;
    usage: string;
  };
  groups: string[];
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

interface ApiResponse {
  items: Word[];
  pagination: PaginationInfo;
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 100;

  useEffect(() => {
    fetchWords();
  }, [currentPage]);

  const fetchWords = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/words?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data: ApiResponse = await response.json();
      setWords(data.items);
      setTotalPages(data.pagination.total_pages);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-primary">Words</h1>
        <p className="text-accent/70">Browse all words in the database</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>German</TableHead>
              <TableHead>Phonetics</TableHead>
              <TableHead>English</TableHead>
              <TableHead className="text-right">Parts</TableHead>
              <TableHead className="text-right">Groups</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((word) => (
              <TableRow key={word.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/words/${word.id}`}
                    className="text-primary hover:underline"
                  >
                    {word.german}
                  </Link>
                </TableCell>
                <TableCell>{word.phonetics}</TableCell>
                <TableCell>{word.english}</TableCell>
                <TableCell className="text-right">
                  {word.parts.type} ({word.parts.usage})
                </TableCell>
                <TableCell className="text-right">
                  {word.groups.join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              size="default"
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
                size="default"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              size="default"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
