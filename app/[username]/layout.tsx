export default async function layout({ children }: { children: React.ReactNode }){
  return <div className="bg-[#f6f3ed]">
    {children}
  </div>
}