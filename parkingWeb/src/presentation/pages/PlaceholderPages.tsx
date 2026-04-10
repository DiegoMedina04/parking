export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-4 text-gray-600">Esta es una página de ejemplo para {title}. Solo accesible por administradores.</p>
  </div>
);
