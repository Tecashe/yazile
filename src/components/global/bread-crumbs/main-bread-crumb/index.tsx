import { PAGE_ICON } from '@/constants/pages';
import React from 'react';

type Props = {
  page: string;
  displayName: string;
  slug?: string;
  isUUID: boolean;
};

const MainBreadCrumb = ({ page, displayName, slug, isUUID }: Props) => {
  return (
    <div className="flex flex-col items-start">
      {page === 'Home' && (
        <div className="flex justify-center w-full">
          <div className="radial--gradient w-11/12 md:w-8/12 lg:w-4/12 py-5 md:py-7 lg:py-10 flex flex-col items-center">
            <p className="text-text-secondary text-base md:text-lg">Welcome,</p>
            <h5 className="capitalize text-2xl md:text-3xl lg:text-4xl font-medium">{slug}!</h5>
          </div>
        </div>
      )}
      <span className="radial--gradient inline-flex py-3 md:py-5 lg:py-10 pr-8 md:pr-12 lg:pr-16 gap-x-2 items-center">
        {isUUID ? PAGE_ICON['AUTOMATION'] : PAGE_ICON[page.toUpperCase()]}
        <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl capitalize">
          {displayName}
        </h2>
      </span>
    </div>
  );
};

export default MainBreadCrumb;
