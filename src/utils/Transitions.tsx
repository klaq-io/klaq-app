import { motion } from "framer-motion";

type TransitionComponentProps = {
  children: React.ReactNode;
};

const TransitionComponent = (props: TransitionComponentProps) => {
  const { children } = props;
  return (
    <>
      <motion.div
        className="slide-in"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="slide-out"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      {children}
    </>
  );
};

export default TransitionComponent;
