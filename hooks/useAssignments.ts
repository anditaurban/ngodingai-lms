import { useState, useEffect, useCallback } from 'react';

export interface AssignmentData {
    assignment_id: number;
    owner_id: number;
    customer_id: number;
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
    [key: string]: any; // Allow additional dynamic fields
}

export const useAssignments = () => {
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    
    // State untuk Proses CRUD
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchAssignments = useCallback(async (page: number, search: string) => {
        try {
            setLoading(true);
            const sessionStr = localStorage.getItem('user_profile');
            if (!sessionStr) return;
            const user = JSON.parse(sessionStr);

            if (!user.customer_id) return;

            const res = await fetch(`/api/assignments/get-table?customerId=${user.customer_id}&page=${page}&search=${encodeURIComponent(search)}&t=${Date.now()}`);
            if (!res.ok) throw new Error("Gagal mengambil data");

            const result = await res.json();
            
            // ✨ PERBAIKAN: Membaca array dari dalam tableData
            const rawData = result.tableData || [];
            
            // Filter Soft Delete (Jika API Katib mengembalikan data dengan visibilitas 'no')
            const activeData = rawData.filter((item: any) => item.visibility !== 'no');

            setAssignments(activeData);
            setTotalPages(result.totalPages || 1);
            setTotalRecords(result.totalRecords || 0);
            setCurrentPage(result.currentPage || 1);

        } catch (error) {
            console.error("Fetch Assignments Error:", error);
            setAssignments([]);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, []);

    // Initial Load & Pagination
    useEffect(() => {
        // Jika pencarian kosong, langsung ambil data berdasarkan halaman
        if (searchQuery === "") {
            fetchAssignments(currentPage, "");
        }
    }, [currentPage, fetchAssignments, searchQuery]);

    // Search Debounce
    useEffect(() => {
        // ✨ LOGIKA BARU: Jika user menghapus teks sampai kosong
        if (searchQuery === "") {
            setIsSearching(false); // 1. Matikan spinner nyangkut
            setCurrentPage(1);     // 2. Reset ke halaman 1
            return;                // 3. Batalkan debounce (biar useEffect ke-1 yang ambil data)
        }

        setIsSearching(true);
        const delayDebounceFn = setTimeout(() => {
            setCurrentPage(1); 
            fetchAssignments(1, searchQuery);
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchAssignments]);

    // ==========================================
    // FUNGSI CRUD (CREATE, UPDATE, DELETE)
    // ==========================================

    const getAuthData = () => {
        const sessionStr = localStorage.getItem('user_profile');
        if (!sessionStr) throw new Error("Sesi tidak ditemukan");
        const user = JSON.parse(sessionStr);
        return { owner_id: user.owner_id || 4409, customer_id: user.customer_id };
    };

    const submitAssignment = async (mode: 'add' | 'edit', data: Partial<AssignmentData>) => {
        setIsProcessing(true);
        try {
            const { owner_id, customer_id } = getAuthData();
            
            // Format Tanggal (YYYY-MM-DD)
            const today = new Date().toISOString().split('T')[0];

            const payload = {
                owner_id,
                customer_id,
                date: data.date || today,
                project_title: data.project_title,
                git_repo: data.git_repo || data.git_repo_url || '', 
                deployment_url: data.deployment_url || '',
                description: data.description || '',
            };

            const url = mode === 'add' ? `/api/assignments/crud` : `/api/assignments/crud?id=${data.assignment_id}`;
            const method = mode === 'add' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Gagal menyimpan data ke server");

            // Refresh Tabel
            await fetchAssignments(currentPage, searchQuery);
            return true;
        } catch (error: any) {
            alert(error.message);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteAssignment = async (assignmentId: number) => {
        setIsProcessing(true);
        try {
            const { owner_id, customer_id } = getAuthData();
            
            // SOFT DELETE: Update data dengan mengubah visibilitas
            const payload = {
                owner_id,
                customer_id,
                visibility: 'no'
            };

            const res = await fetch(`/api/assignments/crud?id=${assignmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Gagal menghapus data");

            // Refresh Tabel
            await fetchAssignments(currentPage, searchQuery);
            return true;
        } catch (error: any) {
            alert(error.message);
            return false;
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