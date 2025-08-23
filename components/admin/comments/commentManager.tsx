"use client";

import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toastContext";
import { getComments, deleteComment } from "@/lib/actions";
import ApprovalToggle from "./approvalToggle";
import { Button } from "@/components/ui/button";
import { Trash2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Comment {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  guestId: {
    fullname: string;
    _id: string;
    phone: string;
  };
  isApproved: boolean;
}

export default function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentComment, setCurrentComment] = useState<Comment>({
    guestId: { fullname: "", _id: "", phone: "" },
    _id: "",
    comment: "",
    isApproved: false,
    rating: 0,
    createdAt: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    loadComments();
    console.log(comments);
  }, []);

  const loadComments = async () => {
    const data = await getComments();
    setComments(data);
    setCurrentComment(data[currentPage - 1]);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > comments.length) return;
    setCurrentPage(page);
    setCurrentComment(comments[page - 1]);
    // Scroll to top of the component
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(comments.length - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("ellipsis1");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < comments.length - 1) {
      pageNumbers.push("ellipsis2");
    }

    // Always show last page if there is more than one page
    if (comments.length > 1) {
      pageNumbers.push(comments.length);
    }

    return pageNumbers;
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("از حذف نظر مطمئنید؟")) {
      try {
        await deleteComment(id);
        if (currentPage === comments.length) {
          if (comments.length > 1) {
            setCurrentPage(comments.length - 1);
            setCurrentComment(comments[comments.length - 2]);
          }
        }
        loadComments();
        toast({
          title: "نظر حذف شد.",
          description: "",
        });
      } catch (error: any) {
        toast({
          title: "خطا در حذف نظر!",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="font-ravi">نظری وجود ندارد.</p>
          </div>
        ) : (
          <Card dir="rtl" className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardDescription className="font-ravi">
                  نمایش {formatCurrency(currentPage)} از {formatCurrency(comments.length)}
                </CardDescription>
                <div className="flex items-center gap-6">
                  <ApprovalToggle
                    key={currentComment._id}
                    comment={currentComment}
                    initialApproved={currentComment.isApproved}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteClick(comments[currentPage - 1]._id)
                    }
                    className="font-ravi"
                  >
                    {/* حذف */}
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 border rounded-md space-y-2">
                  <div className="flex justify-between items-center border-b-2 pb-2">
                    <h3 className="font-semibold text-text_royal_green">
                      {comments[currentPage - 1].guestId.fullname}
                    </h3>
                    <div className="flex gap-2">
                      <p className="text-sm text-text_royal_green font-ravi">
                        {formatDate(
                          comments[currentPage - 1].createdAt!.toString()
                        )}
                      </p>
                      <Link href={`tel:${comments[currentPage - 1].guestId.phone}`}>
                        <PhoneCall className="w-4 h-4 text-golden_yellow fill-golden_yellow" />
                      </Link>
                    </div>
                  </div>
                 
                  <p className="text-sm text-text_royal_green font-ravi">
                      {comments[currentPage - 1].comment}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => {
                    if (page === "ellipsis1" || page === "ellipsis2") {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page as number)}
                        >
                          {formatCurrency(Number(page))}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === comments.length
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
