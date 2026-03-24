import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitPreBooking } from "@/hooks/useQueries";
import {
  CheckCircle2,
  ChevronDown,
  Leaf,
  Menu,
  Package,
  Star,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const LOGO =
  "/assets/uploads/1000244318-removebg-preview-019d1e5d-38c8-7068-8c12-1919f0d0a02f-1.png";

const flavors = [
  {
    id: "strawberry",
    name: "Strawberry Bliss",
    description:
      "Fresh strawberries atop velvety cream cheese with a buttery graham crust.",
    price: "₹220",
    image: "/assets/generated/flavor-strawberry.dim_600x600.jpg",
  },
  {
    id: "blueberry",
    name: "Blueberry Dream",
    description:
      "Wild blueberry compote swirled into our signature cheesecake filling.",
    price: "₹220",
    image: "/assets/generated/flavor-blueberry.dim_600x600.jpg",
  },
  {
    id: "biscoff",
    name: "Crunchy Biscoff",
    description:
      "Crushed Biscoff cookies folded into velvety cream cheese with a caramelised speculoos crust.",
    price: "₹249",
    image: "/assets/generated/flavor-caramel.dim_600x600.jpg",
  },
  {
    id: "chocolate",
    name: "Triple Chocolate",
    description:
      "Dark chocolate ganache, brownie base, and chocolate mousse in every jar.",
    price: "₹220",
    image: "/assets/generated/flavor-chocolate.dim_600x600.jpg",
  },
];

const navLinks = [
  { label: "Shop", href: "#showcase" },
  { label: "Flavors", href: "#showcase" },
  { label: "Our Story", href: "#experience" },
  { label: "FAQs", href: "#faq" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitPreBooking();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFlavor = (id: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const flavorNames = selectedFlavors
      .map((id) => flavors.find((f) => f.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    const orderInterest = `Flavors: ${flavorNames || "Not specified"}; Qty: ${quantity || "1"}`;
    try {
      await submitMutation.mutateAsync({ ...formData, orderInterest });
      setSubmitted(true);
      toast.success("Pre-order submitted! We'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <a href="/" className="flex items-center" data-ocid="nav.link">
              <img
                src={LOGO}
                alt="Cheesoria"
                height={40}
                className="h-10 w-auto object-contain"
              />
            </a>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo("#preorder")}
                className="bg-primary text-primary-foreground hover:opacity-90 uppercase text-xs tracking-widest font-semibold px-5 py-2 rounded-full"
                data-ocid="nav.primary_button"
              >
                Pre-Order Now
              </Button>
            </nav>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-foreground"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-card border-b border-border px-4 pb-4"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left py-3 text-sm font-medium text-muted-foreground border-b border-border last:border-0"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo("#preorder")}
              className="mt-3 w-full bg-primary text-primary-foreground uppercase text-xs tracking-widest font-semibold rounded-full"
            >
              Pre-Order Now
            </Button>
          </motion.div>
        )}
      </header>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-0 min-h-[85vh] items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 md:order-1 -mx-4 md:mx-0 md:-ml-8 lg:-ml-16"
            >
              <img
                src="/assets/generated/hero-jars.dim_1200x800.jpg"
                alt="Cheesoria jar cheesecakes on marble surface"
                className="w-full h-[50vh] md:h-[85vh] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30 hidden md:block" />
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 md:order-2 py-12 md:py-0 md:pl-12 lg:pl-20"
            >
              {/* Hero Logo */}
              <div className="mb-6">
                <img
                  src={LOGO}
                  alt="Cheesoria"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-4">
                Handcrafted Jar Cheesecakes
              </p>
              <h1
                id="hero-heading"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              >
                Indulge in Every{" "}
                <span className="text-primary italic">Spoonful</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
                Premium artisan cheesecakes served in beautiful glass jars —
                perfect for gifting, celebrating, or simply treating yourself.
                Be among the first to taste Cheesoria.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => scrollTo("#preorder")}
                  className="bg-primary text-primary-foreground hover:opacity-90 uppercase tracking-widest text-sm font-semibold px-8 py-6 rounded-full text-base"
                  data-ocid="hero.primary_button"
                >
                  Pre-Order Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollTo("#showcase")}
                  className="border-border text-foreground uppercase tracking-widest text-sm font-semibold px-8 py-6 rounded-full text-base flex items-center gap-2"
                  data-ocid="hero.secondary_button"
                >
                  Explore Flavors <ChevronDown size={16} />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section
        id="showcase"
        className="py-20 bg-card"
        aria-labelledby="showcase-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">
              Our Creations
            </p>
            <h2
              id="showcase-heading"
              className="font-serif text-3xl sm:text-4xl font-bold text-foreground"
            >
              Product Showcase
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {flavors.map((flavor, i) => (
              <motion.div
                key={flavor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-background rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
                data-ocid={`showcase.item.${i + 1}`}
              >
                <div className="overflow-hidden aspect-square">
                  <img
                    src={flavor.image}
                    alt={flavor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif font-semibold text-foreground text-sm sm:text-base mb-1">
                    {flavor.name}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
                    {flavor.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-base sm:text-lg">
                      {flavor.price}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-3"
                      onClick={() => scrollTo("#preorder")}
                    >
                      Order
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section
        id="experience"
        className="py-20 bg-background"
        aria-labelledby="experience-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">
              Why Choose Us
            </p>
            <h2
              id="experience-heading"
              className="font-serif text-3xl sm:text-4xl font-bold text-foreground"
            >
              The Cheesoria Experience
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                icon: <Leaf className="text-primary" size={32} />,
                title: "Natural Ingredients",
                desc: "We source the finest local and imported ingredients — no artificial flavors, no preservatives.",
              },
              {
                icon: <Star className="text-primary" size={32} />,
                title: "Exquisite Flavors",
                desc: "Every flavor is meticulously crafted and taste-tested to deliver a world-class dessert experience.",
              },
              {
                icon: <Package className="text-primary" size={32} />,
                title: "Convenient Jars",
                desc: "Beautifully packaged in sealed glass jars — easy to carry, share, and enjoy anywhere.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-5">
                  {item.icon}
                </div>
                <h3 className="font-serif font-semibold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRE-ORDER FORM */}
      <section
        id="preorder"
        className="py-20 bg-card"
        aria-labelledby="preorder-heading"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">
              Limited Slots
            </p>
            <h2
              id="preorder-heading"
              className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3"
            >
              Secure Your First Jar
            </h2>
            <p className="text-muted-foreground text-base">
              Pre-Order Form — Fill in your details and we'll contact you to
              confirm your order.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-2xl shadow-card p-10 text-center"
              data-ocid="preorder.success_state"
            >
              <CheckCircle2 className="text-primary mx-auto mb-4" size={52} />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                You're on the list!
              </h3>
              <p className="text-muted-foreground">
                Thank you for your pre-order. We'll reach out to confirm your
                flavors and delivery details soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-background rounded-2xl shadow-card p-6 sm:p-10 space-y-6"
              data-ocid="preorder.modal"
            >
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Maria Santos"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    className="bg-input border-border rounded-lg"
                    data-ocid="preorder.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    required
                    className="bg-input border-border rounded-lg"
                    data-ocid="preorder.input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="maria@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  className="bg-input border-border rounded-lg"
                  data-ocid="preorder.input"
                />
              </div>

              {/* Flavor Interest */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Flavor Interest{" "}
                  <span className="normal-case font-normal text-muted-foreground">
                    (select all that apply)
                  </span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {flavors.map((flavor, fi) => (
                    <label
                      key={flavor.id}
                      htmlFor={`flavor-${flavor.id}`}
                      className="flex items-center gap-2.5 p-3 rounded-lg border border-border cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={`flavor-${flavor.id}`}
                        checked={selectedFlavors.includes(flavor.id)}
                        onCheckedChange={() => toggleFlavor(flavor.id)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        data-ocid={`preorder.checkbox.${fi + 1}`}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {flavor.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quantity
                </Label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger
                    className="bg-input border-border rounded-lg"
                    data-ocid="preorder.select"
                  >
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5", "6+"].map((q) => (
                      <SelectItem key={q} value={q}>
                        {q} jar{q !== "1" ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Special Notes{" "}
                  <span className="normal-case text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Any special requests, delivery preferences, or questions..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  rows={3}
                  className="bg-input border-border resize-none rounded-lg"
                  data-ocid="preorder.textarea"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 uppercase tracking-widest font-semibold text-sm py-6 rounded-full"
                data-ocid="preorder.submit_button"
              >
                {submitMutation.isPending
                  ? "Submitting..."
                  : "Submit Pre-Order"}
              </Button>
            </motion.form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-4">
            {[
              {
                q: "When will my order be ready?",
                a: "We'll confirm your order details via phone/email and arrange delivery or pickup within 3-5 business days.",
              },
              {
                q: "Do you offer custom flavors?",
                a: "We're happy to accommodate special requests! Just mention it in the notes section and we'll do our best.",
              },
              {
                q: "How should I store the cheesecakes?",
                a: "Store in the refrigerator and consume within 5 days for optimal freshness. Best enjoyed chilled!",
              },
              {
                q: "Do you deliver nationwide?",
                a: "Currently we service major cities across India. Contact us for delivery inquiries outside our range.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  {item.q}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cheesoria-navy text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="mb-3">
                <img
                  src={LOGO}
                  alt="Cheesoria"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Artisan jar cheesecakes crafted with love and the finest
                ingredients. Available for pre-order now.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                  Company
                </h4>
                <ul className="space-y-2">
                  {["Our Story", "Careers", "Press"].map((l) => (
                    <li key={l}>
                      <a
                        href="/#"
                        className="text-white/70 hover:text-white text-sm transition-colors"
                        data-ocid="footer.link"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                  Legal
                </h4>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "Contact"].map(
                    (l) => (
                      <li key={l}>
                        <a
                          href="/#"
                          className="text-white/70 hover:text-white text-sm transition-colors"
                          data-ocid="footer.link"
                        >
                          {l}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
                Follow Us
              </h4>
              <p className="text-white/60 text-sm mb-3">
                @cheesoria.cheesecake on Instagram & Facebook
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 text-xs uppercase tracking-wider"
                onClick={() => scrollTo("#preorder")}
                data-ocid="footer.primary_button"
              >
                Pre-Order Now
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Cheesoria. All rights reserved.
            </p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/60 text-xs transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
