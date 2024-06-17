const SigninLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="h-screen flex justify-center items-center">
      {children}
    </main>
  );
};

export default SigninLayout;
