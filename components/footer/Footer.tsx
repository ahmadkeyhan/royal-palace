import { usePathname } from "next/navigation";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useLanguage } from "@/contexts/LanguageContext";
import { Laptop, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {};

const Footer: React.FC = (props: Props) => {
  const { t } = useLanguage();
  const route = usePathname();

  return (
    <footer
      className={`${route == "/facility" ? "bg-regal_green" : "bg-off-white"} ${
        route == "/facility" ? "text-white" : "#000"
      }  border-[1px] border-transparent font-ravi text-sm`}
    >
      <div className="min-[680px]:w-[95%] w-[95%] mx-auto pb-4 flex items-start justify-start flex-wrap ">
        <div className="w-full grid gap-4 sm:grid-cols-2 pt-4">
          <div className="flex flex-col items-center gap-2">
            <div className="overflow-hidden h-full max-w-full rounded-md">
              <div
                id="canvas-for-googlemap"
                className="h-full w-full max-w-full"
              >
                <iframe
                  className="h-full w-full border-0"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.4179162377595!2d46.35748229999998!3d38.03734750000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x401a1b0d40808d93%3A0xc97da41ee479c45!2sRoyal%20palace%20hotel!5e0!3m2!1sen!2sus!4v1756213735325!5m2!1sen!2sus`}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <p className="text-sm text-gray-500 flex gap-1">
              <span>
                <MapPin className="w-4 h-4" />
              </span>
              {t("footer.address")}
            </p>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/search?q=royal+palace+tabriz&rlz=1C1GCEA_enIR1090IR1090&oq=ro&gs_lcrp=EgZjaHJvbWUqDggDEEUYJxg7GIAEGIoFMgYIABBFGDwyBwgBEC4YgAQyBggCEEUYOTIOCAMQRRgnGDsYgAQYigUyBggEEEUYPDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDI3NTlqMGo0qAIDsAIB8QW7BGi2AHIrOA&sourceid=chrome&ie=UTF-8#lrd=0x401a1b0d40808d93:0xc97da41ee479c45,3,,,,"
            >
              <Button>{t("footer.review")}</Button>
            </Link>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <p>{t("footer.contact1")}</p>
            <p>{t("footer.contact2")}</p>
            <p>{t("footer.contact3")}</p>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gray-200 mt-4"> </div>
        <div className="w-full">
          <div className="flex sm:col-span-2 justify-center items-center gap-2 text-sm py-4 text-gray-400">
            <Laptop className="w-4 h-4" />
            <p>
              {t("footer.developed")}
              <Link
                href="https://www.instagram.com/key.hansa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="border-b-2 border-golden_yellow font-bold">
                  {t("footer.by")}
                </span>
              </Link>
            </p>
          </div>
          <div className="h-[1px] w-full bg-gray-200"> </div>
          <p className="opacity-[0.4] mt-4 text-center">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
