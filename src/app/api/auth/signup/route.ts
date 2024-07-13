import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../lib/supabase";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt"
export  async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password
          })
       

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        console.log(data)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        res.status(201).json(user);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
