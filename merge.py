import re

with open('src/app/freelancer/page.js', 'r') as f:
    dashboard = f.read()

with open('src/app/freelancer/gigs/page.js', 'r') as f:
    gigs = f.read()

with open('src/app/freelancer/orders/page.js', 'r') as f:
    orders = f.read()

# 1. Clean Gigs component
gigs_comp = gigs.replace('export default function FreelancerGigs() {', 'function FreelancerGigs() {')
gigs_comp = re.sub(r'^.*?function FreelancerGigs', 'function FreelancerGigs', gigs_comp, flags=re.DOTALL)
gigs_comp = gigs_comp.replace('<Navbar />', '')
gigs_comp = gigs_comp.replace('<div className="min-h-screen bg-gray-50 dark:bg-gray-950">', '<div className="w-full">')
gigs_comp = gigs_comp.replace('<div className="max-w-6xl mx-auto p-8">', '<div className="pt-6">')
gigs_comp = gigs_comp.replace('<h1 className="text-3xl font-black text-gray-900 dark:text-white">My Gigs</h1>\n            <p className="text-gray-500 text-sm">Manage the services you offer</p>', '')

# 2. Clean Orders component
orders_comp = orders.replace('export default function FreelancerOrders() {', 'function FreelancerOrders() {')
orders_comp = re.sub(r'^.*?function FreelancerOrders', 'function FreelancerOrders', orders_comp, flags=re.DOTALL)
orders_comp = orders_comp.replace('<Navbar />', '')
orders_comp = orders_comp.replace('<div className="min-h-screen bg-gray-50 dark:bg-gray-950">', '<div className="w-full">')
orders_comp = orders_comp.replace('<div className="max-w-6xl mx-auto p-8">', '<div className="pt-6">')
orders_comp = orders_comp.replace('<h1 className="text-3xl font-black text-gray-900 dark:text-white">My Orders</h1>\n            <p className="text-gray-500 text-sm">Manage your client orders and deliveries</p>', '')

# 3. Create the new dashboard
tab_state = "  const [activeTab, setActiveTab] = useState('gigs');\n"
dashboard = dashboard.replace('const [stats, setStats] = useState({ gigs: 0, orders: 0, earnings: 0 });', 'const [stats, setStats] = useState({ gigs: 0, orders: 0, earnings: 0 });\n' + tab_state)

tab_ui = """
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button 
            onClick={() => setActiveTab('gigs')} 
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'gigs' ? 'border-[#00C6A2] text-[#00C6A2]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Manage Gigs
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'orders' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Manage Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'gigs' ? <FreelancerGigs /> : <FreelancerOrders />}
"""

start_idx = dashboard.find('{/* Quick Links */}')
if start_idx != -1:
    dashboard = dashboard[:start_idx] + tab_ui + '      </div>\n    </div>\n  );\n}\n\n' + gigs_comp + '\n\n' + orders_comp

# Now we need to merge the imports at the top of dashboard!
all_imports = """"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, onSnapshot, orderBy, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Plus, Edit2, List, DollarSign, CheckCircle2, Trash2, Video, Inbox, X, Star } from "lucide-react";
import toast from "react-hot-toast";
import ContactUserButton from "@/components/ContactUserButton";

"""

dashboard = re.sub(r'^.*?(?=export default function FreelancerDashboard)', lambda m: all_imports, dashboard, flags=re.DOTALL)

with open('src/app/freelancer/page.js', 'w') as f:
    f.write(dashboard)

print("Done")
