"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import qs from "query-string";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name");

  const [value, setValue] = useState(name || "");
  const debounceValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debounceValue,
      categoryId: categoryId,
    };
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debounceValue, router, categoryId]);

  return (
    <div className="flex items-center  border border-slate-400  px-4 py-1 rounded-full">
      <Search className="w-4 h-4" />
      <Input
        onChange={onChange}
        value={value}
        placeholder="Search characters"
        className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchInput;
