import { useState, useEffect, useCallback } from 'react';

export interface AssignmentData {
    assignment_id: number;
    owner_id: number;
    customer_id: number;
    course_id?: number | string; // ✨ TAMBAHAN: Untuk relasi database
    date: string;
    course: string;
    project_title: string;
    git_repo_url?: string;
    git_repo?: string; 
    deployment_url?: string;
    description: string;
    evaluation_score: number | string;
    comment: string;
    reviewed: 'yes' | 'no';
    [key: string]: any; 
}

// ✨ FIX: Menerima courseId sebagai argumen opsional
export const useAssignments = (courseId?: number | string) => {
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const getAuthData = () => {
        if (typeof window === 'undefined') return null; 
        const sessionStr = localStorage.getItem('user_profile');
        if (!sessionStr) return null;
        const user = JSON.parse(sessionStr);
        return { owner_id: user.owner_id, customer_id: user.customer_id };
    };

    const fetchAssignments = useCallback(async (page: number, search: string) => {
        setLoading(true);
        try {
            const auth = getAuthData();
            if (!auth || !auth.customer_id) {
                setLoading(false);
                return;
            }

            // ✨ FIX: Tambahkan parameter courseId ke URL jika ada
            let targetUrl = `/api/assignments/get-table?customerId=${auth.customer_id}&page=${page}&search=${encodeURIComponent(search)}&t=${Date.now()}`;
            if (courseId) {
                targetUrl += `&courseId=${courseId}`;
            }
            
            const res = await fetch(targetUrl);
            const result = await res.json();

            if (!res.ok) throw new Error(result.error || result.message || "Gagal mengambil data");

            const payload = result?.data || result; 
            const activeData = payload?.tableData || [];

            setAssignments(activeData);
            setTotalPages(payload?.totalPages || 1);
            setTotalRecords(payload?.totalRecords || activeData.length || 0);
            setCurrentPage(payload?.currentPage || 1);

        } catch (error: any) {
            console.error("Fetch Assignments Error:", error.message);
            setAssignments([]); 
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    // ✨ FIX: Tambahkan courseId ke dalam dependency array
    }, [courseId]); 

    useEffect(() => {
        if (searchQuery === "") {
            fetchAssignments(currentPage, "");
        }
    }, [currentPage, fetchAssignments, searchQuery]);

    useEffect(() => {
        if (searchQuery === "") {
            setIsSearching(false);
            setCurrentPage(1);
            return;
        }

        setIsSearching(true);
        const delayDebounceFn = setTimeout(() => {
            setCurrentPage(1);
            fetchAssignments(1, searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchAssignments]);


    const submitAssignment = async (mode: 'add' | 'edit', data: Partial<AssignmentData>) => {
        setIsProcessing(true);
        try {
            const auth = getAuthData();
            if (!auth) throw new Error("Sesi tidak valid, silakan login ulang.");
            const { owner_id, customer_id } = auth;

            const dateObj = new Date();
            const todayFormatted = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

            const payload: Record<string, any> = {
                owner_id: owner_id,
                customer_id: customer_id,
                course_id: courseId || data.course_id, // ✨ FIX: Suntikkan ID Kelas saat ini
                date: data.date || todayFormatted,
                course: data.course || "Class Assignment", // Fallback string jika backend masih mewajibkan nama
                project_title: data.project_title || '',
                git_repo_url: data.git_repo_url || data.git_repo || '', 
                deployment_url: data.deployment_url || '',
                description: data.description || '',
                evaluation_score: data.evaluation_score || 0,
                comment: data.comment || "",
                reviewed: data.reviewed || "no"
            };

            const url = mode === 'add' ? `/api/assignments/crud` : `/api/assignments/crud?id=${data.assignment_id}`;
            const method = mode === 'add' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Gagal menyimpan data ke server");

            await fetchAssignments(currentPage, searchQuery);

            return {
                success: true,
                message: mode === 'add' ? 'Tugas baru berhasil ditambahkan!' : 'Perubahan tugas berhasil disimpan!'
            };
        } catch (error: any) {
            return { success: false, message: error.message || 'Terjadi kesalahan sistem.' };
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteAssignment = async (id: number) => {
        setIsProcessing(true);
        try {
            const payload = { visibility: 'no' };
            const res = await fetch(`/api/assignments/crud?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                setAssignments((prevData) => prevData.filter((item) => item.assignment_id !== id));
                setTotalRecords((prev) => Math.max(0, prev - 1));
                return { success: true, message: 'Tugas berhasil dihapus!' };
            } else {
                return { success: false, message: result.error || 'Gagal menghapus tugas.' };
            }
        } catch (error: any) {
            console.error("Delete Error:", error);
            return { success: false, message: 'Terjadi kesalahan jaringan (Timeout).' };
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        assignments, loading, isProcessing,
        currentPage, setCurrentPage,
        totalPages, totalRecords,
        searchQuery, setSearchQuery, isSearching,
        submitAssignment, deleteAssignment
    };
};