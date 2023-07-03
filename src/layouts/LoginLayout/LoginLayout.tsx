type Props = {
  children: string | JSX.Element | JSX.Element[];
  backgroundImg?: string;
};

export const LoginLayout = (props: Props) => {
  const { children, backgroundImg } = props;
  return (
    <div className="flex h-screen flex-1">
      {children}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={
            backgroundImg
              ? backgroundImg
              : "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          }
          alt=""
        />
      </div>
    </div>
  );
};
