
class Contact:
    def __init__(self, name, phone):
        self.name = name
        self.phone = phone
    
    def __repr__(self):
        return f"{self.name} - {self.phone}"


class Node:
    """Node for doubly linked list."""
    def __init__(self, contact):
        self.contact = contact
        self.prev = None
        self.next = None


class DoublyLinkedList:
    """Doubly linked list to store contacts in insertion order."""
    def __init__(self):
        self.head = None
        self.tail = None
    
    def append(self, contact):
        """Add a contact to the end of the list."""
        new_node = Node(contact)
        if not self.head:
            self.head = self.tail = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node
    
    def display_forward(self):
        """Display all contacts in forward order."""
        contacts = []
        current = self.head
        while current:
            contacts.append(str(current.contact))
            current = current.next
        return contacts
    
    def display_backward(self):
        """Display all contacts in backward order."""
        contacts = []
        current = self.tail
        while current:
            contacts.append(str(current.contact))
            current = current.prev
        return contacts


class ContactManager:
    """Manages contacts using hash table and doubly linked list."""
    
    def __init__(self):
        self.hash_table = {}  # name -> Contact object
        self.linked_list = DoublyLinkedList()  # maintains insertion order
    
    def add_contact(self, name, phone):
        """Add a new contact to both hash table and linked list."""
        if name in self.hash_table:
            print(f"Error: Contact '{name}' already exists.")
            return False
        
        contact = Contact(name, phone)
        self.hash_table[name] = contact
        self.linked_list.append(contact)
        print("Contact added.")
        return True
    
    def search_by_name(self, name):
        """Search for exact contact by name using hash table (O(1))."""
        if name in self.hash_table:
            contact = self.hash_table[name]
            print(f"Match found: {contact}")
            return contact
        else:
            print(f"No contact found with name '{name}'.")
            return None
    
    def search_by_keyword(self, keyword):
        """Search for contacts using substring matching (naive approach)."""
        keyword = keyword.lower()
        matches = []
        
        for name, contact in self.hash_table.items():
            if keyword in name.lower():
                matches.append(contact)
        
        if matches:
            print(f"Matches found ({len(matches)}):")
            for contact in matches:
                print(f"  {contact}")
            return matches
        else:
            print(f"No contacts match keyword '{keyword}'.")
            return []
    
    def display_all_forward(self):
        """Display all contacts in forward order (insertion order)."""
        contacts = self.linked_list.display_forward()
        if contacts:
            print("All contacts (forward):")
            for i, contact in enumerate(contacts, 1):
                print(f"  {i}. {contact}")
        else:
            print("No contacts in the system.")
    
    def display_all_backward(self):
        """Display all contacts in backward order."""
        contacts = self.linked_list.display_backward()
        if contacts:
            print("All contacts (backward):")
            for i, contact in enumerate(contacts, 1):
                print(f"  {i}. {contact}")
        else:
            print("No contacts in the system.")
    
    def get_contact_count(self):
        """Return the number of contacts."""
        return len(self.hash_table)


def main():
    """Interactive menu-driven contact management system."""
    manager = ContactManager()
    
    while True:
        print("\n" + "="*40)
        print("CONTACT MANAGEMENT SYSTEM")
        print("="*40)
        print("1. Add Contact")
        print("2. Search by Keyword")
        print("3. Search by Exact Name")
        print("4. View All (Forward)")
        print("5. View All (Backward)")
        print("6. Exit")
        print("="*40)
        
        choice = input("Enter option: ").strip()
        
        if choice == "1":
            name = input("Name: ").strip()
            if not name:
                print("Error: Name cannot be empty.")
                continue
            phone = input("Phone: ").strip()
            if not phone:
                print("Error: Phone cannot be empty.")
                continue
            manager.add_contact(name, phone)
        
        elif choice == "2":
            keyword = input("Search keyword: ").strip()
            if not keyword:
                print("Error: Keyword cannot be empty.")
                continue
            manager.search_by_keyword(keyword)
        
        elif choice == "3":
            name = input("Enter name: ").strip()
            if not name:
                print("Error: Name cannot be empty.")
                continue
            manager.search_by_name(name)
        
        elif choice == "4":
            manager.display_all_forward()
        
        elif choice == "5":
            manager.display_all_backward()
        
        elif choice == "6":
            print("Exiting. Goodbye!")
            break
        
        else:
            print("Invalid option. Please try again.")


if __name__ == "__main__":
    main()
