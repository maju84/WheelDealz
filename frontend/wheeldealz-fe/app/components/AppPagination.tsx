'use client';

import { Pagination } from 'flowbite-react';
import React, { useState } from 'react';

type Props = {
    currentPage: number;
    pageCount: number;
}

export default function AppPagination({ currentPage, pageCount }: Props) {
    const [page, setPage] = useState(currentPage);
  return (
    <Pagination
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        totalPages={pageCount}
        layout='pagination'
        showIcons={true}
        className='text-blue-500 mb-5'
    />
  );
}
