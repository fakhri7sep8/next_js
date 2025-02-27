"use client";

import { useFormik, Form, FormikProvider, getIn } from "formik";
import * as yup from "yup";
import { LoginPayload } from "../interface";
import Button from "@/components/Button";
import useAuthModule from "../lib";
import Link from "next/link";
import Label from "@/components/label";
import InputText from "@/components/inputText";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .nullable()
    .default("")
    .email("Gunakan format email")
    .required("Wajib isi"),
  password: yup
    .string()
    .nullable()
    .default("")
    .required("Wajib isi")
    .min(8, "Minimal 8 karakter"),
});

const Login = () => {
  const { data: session, status } = useSession();
  console.log("session", session);
  console.log("status", status);
  const { useLogin } = useAuthModule();
  const { mutate, isPending } = useLogin();

  const formik = useFormik<LoginPayload>({
    initialValues: registerSchema.getDefault(),
    validationSchema: registerSchema,
    enableReinitialize: true,
    onSubmit: (payload) => {
      mutate(payload, {
        onSuccess: (response) => {
          Swal.fire({
            title: "Berhasil!",
            text: "Login berhasil, Anda akan diarahkan ke halaman admin.",
            icon: "success",
          });
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Login gagal! Periksa kembali email dan password Anda.",
            footer: '<a href="#">Kenapa saya mengalami masalah ini?</a>',
          });
        },
      });
    },
  });

  const { handleChange, handleSubmit, handleBlur, values, errors } = formik;

  return (
    <section className="text-black min-h-screen px-10">
      <div className="flex items-center justify-center w-full ">
        <h1 className="text-3xl text-blue-400">Login</h1>
      </div>
      <FormikProvider value={formik}>
        <Form className="space-y-5" onSubmit={handleSubmit}>
          <section>
            <Label htmlFor="email" title="Email" />
            <InputText
              value={values.email}
              placeholder="exampel@email.com"
              id="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              isError={getIn(errors, "email")}
              messageError={getIn(errors, "email")}
            />
          </section>
          <section>
            <Label htmlFor="password" title="Password" />
            <InputText
              value={values.password}
              placeholder="**********"
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              isError={getIn(errors, "password")}
              messageError={getIn(errors, "password")}
            />
          </section>
          <section>
            <Button
              height="lg"
              title="Login"
              colorSchema="blue"
              isLoading={isPending}
              isDisabled={isPending}
            />
            <Link href={"register"}>
              <Button title="Halaman Register" colorSchema="green" />
            </Link>
          </section>
        </Form>
      </FormikProvider>
    </section>
  );
};

export default Login;
