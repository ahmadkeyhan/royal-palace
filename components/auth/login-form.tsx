"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, User, LogIn } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { sendOTPAction, verifyOTPAction } from "@/lib/actions"

const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^(\+98|0)?9\d{9}$/, "Please enter a valid Iranian phone number"),
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  showAsSignup?: boolean;
}

export default function LoginForm({
  onSuccess,
  showAsSignup = true,
}: LoginFormProps) {
  //   const { language } = useLanguage()
  //   const t = getTranslations(language)
  const { t } = useLanguage();
  const { login } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [pendingName, setPendingName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await sendOTPAction(data.phone)

      if (result.success) {
        setPendingPhone(data.phone);
        setPendingName(data.fullname || "");
        setStep("otp");
        setSuccess(t("auth.otpSent"));
      } else {
        setError(result.message || t("auth.otpError"));
      }
    } catch (error) {
      setError(t("auth.networkError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError(t("auth.invalidOtp"));
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await verifyOTPAction(pendingPhone, otpCode, pendingName)

      if (result.success) {
        login(result.guest);
        setSuccess(t("auth.loginSuccess"));
        setStep("form");
        setOtpCode("");
        setPendingPhone("");
        setPendingName("");
        reset();
        onSuccess?.();
      } else {
        setError(result.message || t("auth.verificationError"));
      }
    } catch (error) {
      setError(t("auth.networkError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <Card className="w-full bg-teal-700 rounded-none text-off-white max-w-md py-[102px] mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            {t("auth.verifyPhone")}
          </CardTitle>
          <CardDescription>
            {t("auth.otpSentTo")} {pendingPhone}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>{t("auth.enterOtp")}</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("form");
                setOtpCode("");
                setError("");
                setSuccess("");
              }}
              className="flex-1"
            >
              {t("common.back")}
            </Button>
            <Button
              onClick={handleOTPSubmit}
              disabled={isLoading || otpCode.length !== 6}
              className="flex-1"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("auth.verify")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="club" className="w-full bg-teal-700 rounded-none text-off-white max-w-md py-[102px] mx-auto">
      <CardHeader className="text-center text-golden_yellow mb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <LogIn className="w-5 h-5" />
          {showAsSignup ? t("auth.signup") : t("auth.login")}
        </CardTitle>
        {/* <CardDescription>
          {showAsSignup ? t("auth.signupDesc") : t("auth.loginDesc")}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {showAsSignup && (
            <div className="space-y-2">
              <Label htmlFor="fullname" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("auth.fullName")}
              </Label>
              <Input
                id="fullname"
                {...register("fullname")}
                placeholder={t("auth.fullNamePlaceholder")}
                className="font-ravi text-sm"
              />
              {errors.fullname && (
                <p className="text-sm text-red-500 font-ravi">
                  {errors.fullname.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t("auth.phoneNumber")}
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="09123456789"
              dir="ltr"
              className="font-ravi text-sm"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 font-ravi">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full font-ravi">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {showAsSignup ? t("auth.sendOtpSignup") : t("auth.sendOtpLogin")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
