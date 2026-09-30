import { toast } from "sonner";

export const handleSuccess = ({ message }: { message: string }) => toast.success(message);

export const handleError = ({ message }: { message: string }) => toast.error(message);
