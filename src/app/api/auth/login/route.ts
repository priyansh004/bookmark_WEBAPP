import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

export  async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Signed in successfully" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
