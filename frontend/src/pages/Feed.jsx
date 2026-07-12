import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, FileText, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const loadPosts = async () => {
    try {
      const res = await api.getPosts();
      setPosts(res.posts);
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0627\u062A");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleCreatePost = async () => {
    if (!newPost.trim() && !selectedFile) {
      toast.error("\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0646\u0634\u0648\u0631 \u0623\u0648 \u0625\u0631\u0641\u0627\u0642 \u0645\u0644\u0641");
      return;
    }
    if (!user) {
      toast.error("\u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u0646\u0634\u0631");
      return;
    }
    const formData = new FormData();
    formData.append("content", newPost);
    formData.append("subject", "\u0639\u0627\u0645");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    try {
      const res = await api.createPost(formData);
      setPosts([res.post, ...posts]);
      setNewPost("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("\u062A\u0645 \u0646\u0634\u0631 \u0627\u0644\u0645\u0646\u0634\u0648\u0631 \u0628\u0646\u062C\u0627\u062D");
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u0627\u0644\u0646\u0634\u0631");
    }
  };
  const toggleLike = async (id) => {
    if (!user) {
      toast.error("\u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u062A\u0641\u0627\u0639\u0644 \u0645\u0639 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0627\u062A");
      return;
    }
    try {
      const res = await api.likePost(id);
      setPosts(posts.map((p) => {
        if (p.id === id) {
          const liked = !p.liked_by.includes(user.id);
          const liked_by = liked ? [...p.liked_by, user.id] : p.liked_by.filter((uid) => uid !== user.id);
          return { ...p, likes: res.likes, liked_by };
        }
        return p;
      }));
    } catch (e) {
      toast.error(e.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u0645\u0627");
    }
  };
  const handleToggleComments = async (postId) => {
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
      setComments([]);
      return;
    }
    setOpenCommentsPostId(postId);
    setLoadingComments(true);
    try {
      const res = await api.getComments(postId);
      setComments(res.comments);
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A");
    } finally {
      setLoadingComments(false);
    }
  };
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    if (!user) {
      toast.error("\u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u062A\u0639\u0644\u064A\u0642");
      return;
    }
    try {
      const res = await api.createComment(postId, commentText);
      setComments([...comments, res.comment]);
      setCommentText("");
      setPosts(posts.map((p) => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (e) {
      toast.error(e.message || "\u0641\u0634\u0644 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0642");
    }
  };
  const getAvatarLetter = (name) => {
    return name ? name.trim().charAt(0) : "\u0645";
  };
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  };
  return <div className="max-w-2xl mx-auto space-y-6"><div><h1 className="text-2xl font-display font-bold text-foreground">المجتمع التعليمي</h1><p className="text-muted-foreground mt-1">شارك المعرفة مع زملائك ومعلميك</p></div>{user && <div className="elevated-card rounded-2xl p-5"><Textarea
    placeholder="شارك ملخصاً أو سؤالاً أو مورداً تعليمياً..."
    value={newPost}
    onChange={(e) => setNewPost(e.target.value)}
    className="border-none bg-secondary/50 resize-none rounded-xl min-h-[80px] focus-visible:ring-primary/30 text-foreground"
  /><input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    className="hidden"
    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
  />{selectedFile && <div className="mt-2 flex items-center gap-2 p-2 bg-secondary/30 rounded-xl border border-border text-sm"><Paperclip className="w-4 h-4 text-primary shrink-0" /><span className="text-foreground truncate flex-1">{selectedFile.name}</span><button
    onClick={() => {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }}
    className="text-destructive text-xs hover:underline"
  >
                حذف
              </button></div>}<div className="flex items-center justify-between mt-3"><div className="flex gap-2"><Button
    variant="ghost"
    size="sm"
    className="text-muted-foreground gap-2 hover:bg-secondary"
    onClick={() => fileInputRef.current?.click()}
  ><FileText className="w-4 h-4 text-primary" /> إرفاق ملف
              </Button></div><Button
    size="sm"
    onClick={handleCreatePost}
    className="gap-2 gradient-primary text-primary-foreground rounded-xl px-5"
  ><Send className="w-4 h-4" /> نشر
            </Button></div></div>}{loading ? <div className="text-center py-10 text-muted-foreground">جاري تحميل المنشورات...</div> : posts.length === 0 ? <div className="text-center py-10 text-muted-foreground bg-secondary/20 rounded-2xl">
          لا يوجد منشورات حالياً. كن أول من ينشر!
        </div> : posts.map((post, i) => {
    const isLiked = user ? post.liked_by.includes(user.id) : false;
    return <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.05, 0.5) }}
      className="elevated-card rounded-2xl p-5"
    ><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">{getAvatarLetter(post.author_name)}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-foreground">{post.author_name}</span><span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{post.author_role === "student" ? "\u0637\u0627\u0644\u0628" : post.author_role === "teacher" ? "\u0645\u0639\u0644\u0645" : "\u0645\u062F\u064A\u0631"}</span><span className="text-xs text-muted-foreground mr-auto">{formatTime(post.created_at)}</span></div><p className="mt-2 text-foreground/90 leading-relaxed whitespace-pre-wrap">{post.content}</p>{post.file_url && <div className="mt-3 flex items-center gap-2 p-3 bg-secondary/60 rounded-xl border border-border/50"><FileText className="w-5 h-5 text-primary shrink-0" /><span className="text-sm font-medium text-foreground truncate flex-1">{post.file_url.split("/").pop()}</span><a
      href={`http://localhost:5000${post.file_url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary text-xs font-semibold hover:underline shrink-0"
    >
                        تحميل
                      </a></div>}<div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50"><button
      onClick={() => toggleLike(post.id)}
      className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
    ><Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />{post.likes}</button><button
      onClick={() => handleToggleComments(post.id)}
      className={`flex items-center gap-1.5 text-sm transition-colors ${openCommentsPostId === post.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
    ><MessageCircle className="w-4 h-4" />{post.comments}</button><button
      onClick={() => {
        navigator.clipboard.writeText(`http://localhost:5173/feed`);
        toast.success("\u062A\u0645 \u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629");
      }}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mr-auto"
    ><Share2 className="w-4 h-4" /></button></div>{
      /* Comments Section */
    }<AnimatePresence>{openCommentsPostId === post.id && <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 border-t border-border/50 space-y-3 overflow-hidden"
    ><h4 className="text-sm font-bold text-foreground mb-2">التعليقات</h4>{loadingComments ? <div className="text-xs text-muted-foreground">جاري تحميل التعليقات...</div> : comments.length === 0 ? <div className="text-xs text-muted-foreground bg-secondary/20 p-3 rounded-xl">لا توجد تعليقات بعد.</div> : <div className="space-y-2 max-h-60 overflow-y-auto pr-1">{comments.map((c) => <div key={c.id} className="p-3 bg-secondary/50 rounded-xl space-y-1"><div className="flex justify-between items-center text-xs"><span className="font-semibold text-foreground">{c.author_name}</span><span className="text-muted-foreground text-[10px]">{formatTime(c.created_at)}</span></div><p className="text-xs text-foreground/90 leading-relaxed">{c.content}</p></div>)}</div>}{user && <div className="flex gap-2 mt-2"><input
      type="text"
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="اكتب تعليقاً..."
      className="flex-1 bg-secondary/60 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
      onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
    /><Button
      size="sm"
      className="rounded-xl px-3"
      onClick={() => handleAddComment(post.id)}
    >
                              تعليق
                            </Button></div>}</motion.div>}</AnimatePresence></div></div></motion.div>;
  })}</div>;
};
var Feed_default = Feed;
export {
  Feed_default as default
};
