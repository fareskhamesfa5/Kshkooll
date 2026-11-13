// Koshkool Authentication — Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "../js/supabase-config.js";

const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  SUPABASE_PUBLISHABLE_KEY &&
  !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_");

const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

function showStatus(element, message, success = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = success ? "#18794e" : "#a33";
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function requireConfig(status) {
  if (!supabase) {
    showStatus(status, "أولاً ضع Project URL و Publishable Key في الملف js/supabase-config.js ثم أعد تحميل الصفحة.");
    return false;
  }
  return true;
}

// Login page
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const status = document.getElementById("status");
  const emailField = document.getElementById("identity");
  const rememberBox = document.getElementById("remember");
  const savedEmail = localStorage.getItem("koshkool_saved_email");
  if (savedEmail && emailField && rememberBox) {
    emailField.value = savedEmail;
    rememberBox.checked = true;
  }

  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const field = document.getElementById("password");
      const showing = field.type === "text";
      field.type = showing ? "password" : "text";
      togglePassword.textContent = showing ? "إظهار" : "إخفاء";
    });
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireConfig(status)) return;
    const email = normalizeEmail(emailField.value);
    const password = document.getElementById("password").value;
    if (!email || !password) {
      showStatus(status, "اكتب البريد الإلكتروني وكلمة المرور.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showStatus(status, error.message.includes("Email not confirmed")
        ? "أكد بريدك الإلكتروني من الرسالة التي أرسلناها لك أولاً."
        : "تعذر تسجيل الدخول. راجع البريد وكلمة المرور وحاول مرة أخرى.");
      return;
    }

    if (rememberBox?.checked) localStorage.setItem("koshkool_saved_email", email);
    else localStorage.removeItem("koshkool_saved_email");

    showStatus(status, "تم تسجيل الدخول بنجاح. جاري فتح لوحة التحكم...", true);
    window.location.href = "../pages/dashboard.html";
  });
}

// Registration page
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("registerStatus");
    if (!requireConfig(status)) return;

    const name = document.getElementById("fullName").value.trim();
    const email = normalizeEmail(document.getElementById("registerIdentity").value);
    const password = document.getElementById("registerPassword").value;
    const confirmation = document.getElementById("confirmPassword").value;

    if (!name || !email || !password) {
      showStatus(status, "من فضلك أكمل كل البيانات.");
      return;
    }
    if (password.length < 10) {
      showStatus(status, "استخدم كلمة مرور من 10 أحرف على الأقل.");
      return;
    }
    if (password !== confirmation) {
      showStatus(status, "كلمتا المرور غير متطابقتين.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + "/auth/login.html"
      }
    });

    if (error) {
      showStatus(status, "لم نتمكن من إنشاء الحساب: " + error.message);
      return;
    }

    registerForm.reset();
    if (data.session) {
      showStatus(status, "تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.", true);
    } else {
      showStatus(status, "تم إنشاء الحساب. افتح بريدك الإلكتروني واضغط رابط التأكيد، ثم سجّل الدخول.", true);
    }
  });
}

// Password recovery — send reset email
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("forgotStatus");
    if (!requireConfig(status)) return;
    const email = normalizeEmail(document.getElementById("recoveryIdentity").value);
    if (!email) {
      showStatus(status, "اكتب البريد الإلكتروني.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password.html"
    });
    showStatus(status, error
      ? "تعذر إرسال رسالة الاستعادة: " + error.message
      : "لو البريد مسجل، هتوصلك رسالة فيها رابط تغيير كلمة المرور.", !error);
  });
}

// Set a new password after opening the email recovery link
const resetForm = document.getElementById("resetPasswordForm");
if (resetForm) {
  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("resetStatus");
    if (!requireConfig(status)) return;
    const password = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmNewPassword").value;
    if (password.length < 10) {
      showStatus(status, "استخدم كلمة مرور من 10 أحرف على الأقل.");
      return;
    }
    if (password !== confirm) {
      showStatus(status, "كلمتا المرور غير متطابقتين.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) showStatus(status, "تعذر تغيير كلمة المرور: " + error.message);
    else {
      showStatus(status, "تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.", true);
      setTimeout(() => window.location.href = "login.html", 1200);
    }
  });
}

