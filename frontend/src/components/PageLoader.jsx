import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      data-theme={theme}
    >
      <span className="loading loading-dots loading-xl text-primary"></span>
    </div>
  );
};

export default PageLoader;
