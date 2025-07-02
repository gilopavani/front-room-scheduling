"use client";

import { Suspense } from "react";
import RegisterForm from "./index";

function RegisterFormSuspended() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

export default RegisterFormSuspended;
