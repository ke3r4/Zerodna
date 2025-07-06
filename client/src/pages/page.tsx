import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import MetaHead from "@/components/meta-head";
import NotFound from "@/pages/not-found";

export default function Page() {
  const { slug } = useParams();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["/api/pages/slug", slug],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zerodna-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return <NotFound />;
  }

  return (
    <>
      <MetaHead 
        title={`${page.title} | ZeroDNA`}
        description={page.metaDescription || `${page.title} - ZeroDNA`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </>
  );
}