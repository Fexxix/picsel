export default function Layout({
  children,
  lightbox,
}: {
  children: React.ReactNode;
  lightbox: React.ReactNode;
}) {
  return (
    <>
      {children}
      {lightbox}
    </>
  );
}
