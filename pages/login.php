<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Login - Inovasia Digital Academy</title>
    
    <!-- Google Fonts & Icons -->
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    
    <!-- Alpine.js -->
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <!-- Theme Config (Sama seperti sebelumnya) -->
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#4040d4",
                        "primary-dark": "#3030b0",
                        "background-light": "#f6f6f8",
                        "background-dark": "#13131f",
                        "surface-dark": "#1c1c2e",
                    },
                    fontFamily: { "display": ["Manrope", "sans-serif"] },
                    boxShadow: { 'soft': '0 20px 40px -10px rgba(64, 64, 212, 0.15)', 'glow': '0 0 40px -10px rgba(64, 64, 212, 0.3)' }
                },
            },
        }
    </script>
    <style>
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); }
        .dark .glass-panel { background: rgba(28, 28, 46, 0.95); }
        .mesh-gradient {
            background-color: #f6f6f8;
            background-image: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(242,65%,44%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(338,22%,25%,1) 0, transparent 50%);
            background-size: 100% 100%;
        }
        .dark .mesh-gradient {
            background-color: #13131f;
            background-image: radial-gradient(at 10% 30%, hsla(242, 65%, 44%, 0.25) 0px, transparent 50%), radial-gradient(at 90% 10%, hsla(260, 60%, 60%, 0.15) 0px, transparent 50%);
        }
    </style>
</head>
<body class="font-display bg-background-light dark:bg-background-dark text-[#121217] dark:text-white min-h-screen flex flex-col relative overflow-hidden">
    
    <div class="absolute inset-0 z-0 mesh-gradient opacity-90"></div>
    <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="relative z-10 flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        
        <!-- LOGIC ALPINE JS DIMULAI DISINI -->
        <div x-data="{ 
                loginState: 'phone', 
                phoneNumber: '',
                isLoading: false,
                otpValues: ['', '', '', '', '', ''],
                errorMessage: '',

                // 1. Fungsi Cek Nomor HP
                async checkPhone() {
                    this.errorMessage = '';
                    if(this.phoneNumber.length < 9) {
                        this.errorMessage = 'Nomor HP terlalu pendek';
                        return;
                    }

                    this.isLoading = true;
                    
                    try {
                        const response = await fetch('../functions/auth.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'check_phone', phone: this.phoneNumber })
                        });
                        const result = await response.json();

                        if (result.status === 'success') {
                            this.loginState = 'otp';
                            // Fokus ke input OTP pertama setelah render
                            this.$nextTick(() => { document.getElementById('otp-0').focus(); });
                        } else {
                            this.errorMessage = result.message;
                        }
                    } catch (error) {
                        this.errorMessage = 'Terjadi kesalahan jaringan';
                    } finally {
                        this.isLoading = false;
                    }
                },

                // 2. Fungsi Verifikasi OTP & Login
                async verifyLogin() {
                    const otpCode = this.otpValues.join('');
                    if (otpCode.length < 6) {
                        this.errorMessage = 'Lengkapi kode 6 digit';
                        return;
                    }

                    this.isLoading = true;
                    this.errorMessage = '';

                    try {
                        const response = await fetch('../functions/auth.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'login', phone: this.phoneNumber, otp: otpCode })
                        });
                        const result = await response.json();

                        if (result.status === 'success') {
                            window.location.href = result.redirect;
                        } else {
                            this.errorMessage = result.message;
                            this.otpValues = ['', '', '', '', '', '']; // Reset OTP jika salah
                            document.getElementById('otp-0').focus();
                        }
                    } catch (error) {
                        this.errorMessage = 'Terjadi kesalahan sistem';
                    } finally {
                        this.isLoading = false;
                    }
                },

                // 3. Logic Pindah Kolom & Paste
                handleInput(index, event) {
                    const value = event.target.value;
                    
                    // Hanya izinkan angka
                    if (!/^\d*$/.test(value)) {
                        this.otpValues[index] = '';
                        return;
                    }

                    if (value.length === 1) {
                        if (index < 5) {
                            document.getElementById(`otp-${index + 1}`).focus();
                        } else {
                            // Jika kolom terakhir diisi, otomatis trigger login (Opsional)
                            // this.verifyLogin(); 
                            document.getElementById(`otp-${index}`).blur(); // Lepas fokus
                        }
                    }
                },
                
                handleBackspace(index, event) {
                    if (event.key === 'Backspace' && this.otpValues[index] === '') {
                        if (index > 0) document.getElementById(`otp-${index - 1}`).focus();
                    }
                },

                handlePaste(event) {
                    event.preventDefault();
                    const pastedData = event.clipboardData.getData('text').slice(0, 6);
                    if (!/^\d+$/.test(pastedData)) return; // Hanya angka

                    for (let i = 0; i < pastedData.length; i++) {
                        this.otpValues[i] = pastedData[i];
                    }
                    
                    // Fokus ke input selanjutnya setelah paste
                    if (pastedData.length < 6) {
                        document.getElementById(`otp-${pastedData.length}`).focus();
                    } else {
                         document.getElementById('otp-5').focus();
                    }
                }
             }" 
             class="w-full max-w-[480px] glass-panel rounded-2xl sm:rounded-[32px] shadow-soft border border-white/50 dark:border-white/10 p-8 sm:p-10 flex flex-col gap-8 transition-all duration-300">
            
            <!-- Header (Logo dll) -->
            <header class="flex flex-col gap-6">
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <svg class="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path></svg>
                    </div>
                    <span class="text-xl font-bold tracking-tight text-[#121217] dark:text-white">Inovasia</span>
                </div>
                <div class="space-y-2">
                    <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#121217] dark:text-white leading-[1.1]">Digital Academy</h1>
                    <p class="text-[#666685] dark:text-gray-400 text-base font-medium leading-normal">Log in to continue your learning journey.</p>
                </div>
            </header>

            <form @submit.prevent class="flex flex-col gap-6">
                
                <!-- ERROR ALERT -->
                <div x-show="errorMessage" x-transition class="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">error</span>
                    <span x-text="errorMessage"></span>
                </div>

                <!-- STEP 1: INPUT NOMOR HP -->
                <div class="flex flex-col gap-2">
                    <label class="text-[#121217] dark:text-gray-200 text-sm font-bold uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <div class="group flex w-full items-center rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-surface-dark focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200 h-14 overflow-hidden relative"
                         :class="{ 'opacity-75 pointer-events-none bg-gray-50': loginState === 'otp' }">
                        <div class="pl-4 flex items-center justify-center text-[#666685] dark:text-gray-500 group-focus-within:text-primary transition-colors">
                            <span class="material-symbols-outlined text-[24px]">chat_bubble</span>
                        </div>
                        <div class="flex items-center justify-center pl-3 pr-2 border-r border-transparent">
                            <span class="text-[#121217] dark:text-white font-semibold text-base">+62</span>
                        </div>
                        
                        <!-- Input No HP -->
                        <input x-model="phoneNumber"
                               @keydown.enter.prevent="if(loginState === 'phone') checkPhone()"
                               class="flex-1 w-full bg-transparent border-none text-[#121217] dark:text-white placeholder:text-[#9999a9] dark:placeholder:text-gray-600 focus:ring-0 text-base font-medium h-full px-3" 
                               placeholder="812 3456 7890" type="tel" :readonly="loginState === 'otp'"/>
                        
                        <button type="button" @click="loginState = 'phone'; errorMessage = ''; otpValues=['','','','','','']"
                                x-show="loginState === 'otp'"
                                class="mr-4 text-xs font-bold text-primary hover:underline pointer-events-auto z-20">
                            CHANGE
                        </button>
                    </div>
                </div>

                <!-- STEP 2: INPUT OTP -->
                <div x-show="loginState === 'otp'" 
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 translate-y-4"
                     x-transition:enter-end="opacity-100 translate-y-0"
                     class="flex flex-col gap-4">
                    
                    <div class="flex justify-between items-baseline">
                        <label class="text-[#121217] dark:text-gray-200 text-sm font-bold uppercase tracking-wider">Enter 6-Digit Code</label>
                    </div>
                    
                    <!-- 6 Digit OTP Inputs -->
                    <fieldset class="flex gap-2 justify-between" @paste="handlePaste($event)">
                        <template x-for="(value, index) in otpValues" :key="index">
                            <input :id="'otp-' + index"
                                   type="text" 
                                   inputmode="numeric" 
                                   maxlength="1" 
                                   x-model="otpValues[index]"
                                   @input="handleInput(index, $event)"
                                   @keydown="handleBackspace(index, $event)"
                                   class="otp-input h-12 sm:h-14 w-full rounded-xl border border-[#eaeaef] dark:border-gray-700 bg-white dark:bg-surface-dark text-[#121217] dark:text-white text-xl sm:text-2xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-center"
                            />
                        </template>
                    </fieldset>
                    
                    <p class="text-xs text-[#666685] dark:text-gray-500 text-center mt-1">
                        Use dummy OTP: <span class="font-bold text-primary">123456</span>
                    </p>
                </div>

                <!-- SUBMIT BUTTON -->
                <button type="button"
                        @click="loginState === 'phone' ? checkPhone() : verifyLogin()"
                        :disabled="isLoading"
                        class="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary-dark text-white text-base font-bold tracking-[0.015em] transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                    
                    <span x-show="isLoading" class="absolute inset-0 flex items-center justify-center bg-primary">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </span>

                    <span x-show="!isLoading" class="z-10 flex items-center gap-2">
                        <span x-text="loginState === 'phone' ? 'Send Verification Code' : 'Verify & Login'"></span>
                        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </span>
                </button>
            </form>

            <footer class="flex justify-center gap-6 pt-2">
                <a class="text-sm font-semibold text-[#666685] flex items-center gap-1.5" href="#"><span class="material-symbols-outlined text-[18px]">help</span>Help Center</a>
                <a class="text-sm font-semibold text-[#666685] flex items-center gap-1.5" href="#"><span class="material-symbols-outlined text-[18px]">lock</span>Privacy Policy</a>
            </footer>
        </div>
        
        <div class="mt-8 text-center relative z-10 opacity-60"><p class="text-xs font-medium text-[#666685]">© 2024 Inovasia Digital Academy.</p></div>
    </div>
</body>
</html>