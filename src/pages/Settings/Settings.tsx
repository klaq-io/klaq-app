import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { PageLayout } from "../../layouts";
import { Button } from "components";

export const Settings = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
    </PageLayout>
  );
};
