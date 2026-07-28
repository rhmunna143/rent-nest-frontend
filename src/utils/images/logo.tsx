import Image from "next/image";
import * as React from "react";
import logo from "@/app/_assets/images/logo.png";

interface ILogoProps {}

const Logo: React.FunctionComponent<ILogoProps> = (props) => {
  return (
    <>
      <Image src={logo} alt="Logo | RentNest" width={70} height={70} loading="eager" />
    </>
  );
};

export default Logo;
