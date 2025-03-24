import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";

const Sidebar = ({ expand, setExpand }) => {
  return (
    <div
      className={`flex flex-col justify-between bg-[#FFC9DE] pt-7 transition-all z-50 max-md:absolute max-md:h-screen ${
        expand ? "p-4 w-64" : "md:w-20 w-0 max-md:overflow-hidden"
      }`}
    >
      <div>
        <Image src={expand ? assets.logo_text : assets.logo_icon} alt="" />

        <div>
          <Image src={assets.menu_icon} alt="Menu icon" className="md:hidden" />
          <Image
            src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
            alt="Menu icon"
            className="hidden md:block w-7"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
