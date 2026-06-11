// ════════════════════════════════════════════════════════
// CodeTale v3 — Full Curriculum
// 6 Phases · 18 Chapters · Interview Galaxy
// ════════════════════════════════════════════════════════

export const AVATARS = ['🧑‍💻', '👩‍💻', '🦊', '🐉', '🤖', '🧙‍♂️', '🦸', '🐱', '🐧', '⚡', '🔮', '🎮'];

export const PHASES = [
  { id: 'phase1', number: 1, title: 'Foundations',            subtitle: 'Week 1–2',  emoji: '🥚', desc: 'Variables, control flow, loops — your first programs', chapters: ['ch1','ch2','ch3'] },
  { id: 'phase2', number: 2, title: 'Functions & Collections', subtitle: 'Week 3–4',  emoji: '🌱', desc: 'Functions, lists, strings, and your first patterns',    chapters: ['ch4','ch5','ch6'] },
  { id: 'phase3', number: 3, title: 'Data Structures',         subtitle: 'Month 2',   emoji: '🏰', desc: 'Hash maps, stacks, linked lists, recursion',            chapters: ['ch7','ch8','ch9','ch10'] },
  { id: 'phase4', number: 4, title: 'Algorithms',              subtitle: 'Month 3',   emoji: '🔥', desc: 'Sorting, binary search, two pointers, greedy',          chapters: ['ch11','ch12','ch13','ch14'] },
  { id: 'phase5', number: 5, title: 'Advanced DSA',            subtitle: 'Month 4',   emoji: '⚡', desc: 'Trees, graphs, heaps, dynamic programming',             chapters: ['ch15','ch16','ch17','ch18'] },
  { id: 'phase6', number: 6, title: 'Interview Galaxy',         subtitle: 'Final',     emoji: '🌟', desc: '30 patterns, company dungeons, mock interviews',        chapters: [], isInterviewGalaxy: true },
];

// ── Helper ────────────────────────────────────────────────
export const getChaptersByPhase = (phaseId) =>
  Object.values(CHAPTERS).filter(ch => ch.phaseId === phaseId);

export const getChapterById = (id) => CHAPTERS[id];

// ════════════════════════════════════════════════════════
// CHAPTERS
// ════════════════════════════════════════════════════════
export const CHAPTERS = {

  // ─────────────────────────────────────────────────────
  // PHASE 1 — FOUNDATIONS
  // ─────────────────────────────────────────────────────
  ch1: {
    id: 'ch1', phaseId: 'phase1', number: 1,
    title: 'Python Basics', emoji: '🐍', nextChapter: 'ch2',
    topics: ['Variables & Types', 'Operators', 'f-strings', 'Input/Output'],
    lesson: {
      hook: {
        title: '🤯 Your phone runs on these exact concepts',
        content: "Every app you use stores data in variables. Instagram's like_count, your battery_level, is_notifications_on — all variables. When you open WhatsApp, Python-style code checks: if user_is_logged_in → show chats. You're about to learn the same building blocks used by every app on earth.",
      },
      story: {
        title: "📦 Byte's Magic Labeled Boxes",
        content: `Imagine Byte has a storage room full of labeled boxes.

One box is labeled "name" — it holds the text "Byte".
Another says "score" — it holds the number 42.
Another says "is_happy" — it holds True.

That's all a variable is — a labeled box that remembers a value.

Python lets you create 4 kinds of boxes:
  📝 Text box (str)     → name = "Byte"
  🔢 Number box (int)   → score = 42
  💧 Decimal box (float) → height = 1.72
  ✅ Yes/No box (bool)  → is_happy = True

The label on the left, = in the middle, value on the right.
That's it. That's a variable.`,
      },
      real: {
        title: '📐 The Technical Definition',
        content: `A variable is a named reference to a value stored in memory.

SYNTAX:
  variable_name = value

TYPES:
  str   → "hello", 'world', "42 is a number as text"
  int   → 42, -7, 0, 1_000_000  (underscore = readability)
  float → 3.14, -0.5, 1.0
  bool  → True, False  (capital T and F!)

NAMING RULES:
  ✓ Letters, digits, underscores
  ✓ Cannot start with a digit
  ✓ Case-sensitive: Name ≠ name ≠ NAME
  ✓ Convention: snake_case  (player_score, not playerScore)
  ✗ Reserved words: if, for, while, def, class, etc.

F-STRINGS (modern string formatting):
  name = "Byte"
  age = 5
  print(f"Hi, I'm {name} and I'm {age} years old.")
  → Hi, I'm Byte and I'm 5 years old.

TYPE CHECKING:
  type(42)      → <class 'int'>
  type("hello") → <class 'str'>
  type(True)    → <class 'bool'>`,
      },
      codeExample: `# Variables - all 4 types
player = "Alex"          # str
level = 7                # int  
health = 85.5            # float
is_alive = True          # bool

# f-string formatting
print(f"Player: {player}")
print(f"Level {level} | HP: {health} | Alive: {is_alive}")

# Type checking
print(type(player))    # <class 'str'>
print(type(level))     # <class 'int'>

# Arithmetic operators
score = 100
bonus = 25
total = score + bonus
print(f"Score: {score} + {bonus} = {total}")

# String operations
greeting = "Hello" + ", " + player + "!"
print(greeting)
print(f"Name has {len(player)} letters")`,
    },
    problems: [
      {
        id: 'ch1_p1', title: "Byte's Name Tag", difficulty: 'Easy', xp: 50,
        pattern: 'Variables & f-strings',
        story: `Byte's at a hackathon and forgot his name tag! The organizer needs his name and age on a single line.\n\nExpected output:\nHi, I am Byte and I am 5 years old.`,
        real: `Create two variables:\n  name = "Byte"\n  age = 5\n\nPrint using an f-string:\n  "Hi, I am {name} and I am {age} years old."`,
        starter: `# Create name variable (string)\nname = "___"\n\n# Create age variable (integer)\nage = ___\n\n# Print using f-string\nprint(f"Hi, I am ___ and I am ___ years old.")`,
        solution: `name = "Byte"\nage = 5\nprint(f"Hi, I am {name} and I am {age} years old.")`,
        expected: 'Hi, I am Byte and I am 5 years old.',
        hints: ['Text values need quotes: name = "Byte"', 'Numbers have no quotes: age = 5', 'In f-strings, wrap variable names in {curly braces}'],
        traps: ['Forgetting quotes around string', 'Putting numbers in quotes'],
      },
      {
        id: 'ch1_p2', title: 'Cookie Math', difficulty: 'Easy', xp: 60,
        pattern: 'Arithmetic operators',
        story: `Byte baked 7 cookies 🍪\n\nPrint:\n1. The original count\n2. The doubled batch\n3. Whether he has more than 10\n\nExpected output:\nCookies: 7\nDoubled: 14\nMore than 10? False`,
        real: `Given cookies = 7:\n  Print "Cookies: 7"\n  Print "Doubled: {cookies * 2}"\n  Print "More than 10? {cookies > 10}"`,
        starter: `cookies = 7\nprint("Cookies:", cookies)\nprint("Doubled:", ___)     # multiply by 2\nprint("More than 10?", ___)  # comparison operator`,
        solution: `cookies = 7\nprint("Cookies:", cookies)\nprint("Doubled:", cookies * 2)\nprint("More than 10?", cookies > 10)`,
        expected: 'Cookies: 7\nDoubled: 14\nMore than 10? False',
        hints: ['Use * for multiplication: cookies * 2', 'Use > for "greater than": cookies > 10 returns True or False automatically'],
        traps: ['Using × instead of *', 'Not knowing comparisons auto-return True/False'],
      },
      {
        id: 'ch1_p3', title: 'User Greeter', difficulty: 'Easy', xp: 80,
        pattern: 'input() + type conversion',
        story: `Build a greeter that asks for name and age, then responds.\n\nInput: "Alex", "20"\nExpected output:\nHello Alex! You are 20 years old. Welcome to CodeTale! 🎮`,
        real: `Use input() to get name (string) and age.\nConvert age to int with int().\nPrint with f-string.`,
        starter: `# Get name from user\nname = input("Enter your name: ")\n\n# Get age and convert to integer\nage = ___(input("Enter your age: "))\n\n# Print greeting\nprint(f"Hello ___! You are ___ years old. Welcome to CodeTale! 🎮")`,
        solution: `name = input("Enter your name: ")\nage = int(input("Enter your age: "))\nprint(f"Hello {name}! You are {age} years old. Welcome to CodeTale! 🎮")`,
        expected: 'Hello Alex! You are 20 years old. Welcome to CodeTale! 🎮',
        hints: ['input() always returns a string — use int() to convert: age = int(input(...))', 'f-strings: print(f"Hello {name}!")'],
        traps: ['Forgetting int() — input() returns string even for numbers'],
      },
    ],
    boss: {
      id: 'ch1_boss', title: 'Variable Vault', desc: 'All 4 types, one profile, no hints!',
      timeLimit: 240, xp: 150,
      story: `Create a player profile with all 4 data types:\n  username = "Hero"\n  level = 1\n  health = 100.0\n  is_alive = True\n\nPrint:\n=== HERO PROFILE ===\nName: Hero | Level: 1 | HP: 100.0 | Active: True`,
      solution: `username = "Hero"\nlevel = 1\nhealth = 100.0\nis_alive = True\nprint("=== HERO PROFILE ===")\nprint(f"Name: {username} | Level: {level} | HP: {health} | Active: {is_alive}")`,
      expected: '=== HERO PROFILE ===\nName: Hero | Level: 1 | HP: 100.0 | Active: True',
    },
  },

  ch2: {
    id: 'ch2', phaseId: 'phase1', number: 2,
    title: 'Control Flow', emoji: '🔀', nextChapter: 'ch3',
    topics: ['if / elif / else', 'Comparison operators', 'Logical operators (and/or/not)', 'Ternary expressions'],
    lesson: {
      hook: { title: '🤯 Every app decision is an if statement', content: 'When Netflix shows "Are you still watching?" — that\'s an if statement. When your bank says "Transaction declined" — if balance < amount. When Spotify picks the next song — hundreds of if/elif chains. Control flow is literally how software makes decisions.' },
      story: {
        title: '🚦 Byte at a Traffic Light',
        content: `Byte is driving. He approaches a traffic light.

if light == "red":
    stop()
elif light == "yellow":
    slow_down()  
else:
    drive()

Python checks conditions TOP to BOTTOM.
The FIRST one that's True → runs that block → skips the rest.

Think of it like a waterfall — water flows down and falls into the FIRST bucket it reaches.

COMPARISON OPERATORS (for conditions):
  ==   equals?
  !=   not equal?
  >    greater than?
  <    less than?
  >=   greater or equal?
  <=   less or equal?

COMBINING CONDITIONS:
  and → BOTH must be True
  or  → AT LEAST ONE must be True
  not → flips True to False`,
      },
      real: {
        title: '📐 Syntax & Rules',
        content: `SYNTAX:
  if condition:
      # indented block runs if True
  elif another_condition:
      # runs if first False, this True
  else:
      # runs if ALL above False

CRITICAL RULES:
  ✓ Colon : after every condition
  ✓ Indentation = 4 spaces (Python is strict!)
  ✓ = is assignment, == is comparison
  ✓ elif and else are optional
  
TERNARY (one-liner if/else):
  result = "pass" if score >= 50 else "fail"
  label = "adult" if age >= 18 else "minor"

LOGICAL OPERATORS:
  if age >= 18 and has_id:   → both required
  if is_admin or is_owner:   → either works
  if not is_banned:          → reverse condition`,
      },
      codeExample: `# Grade calculator
score = 87

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score} → Grade: {grade}")

# Logical operators
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed")
else:
    print("Entry denied")

# Ternary expression
status = "adult" if age >= 18 else "minor"
print(f"Status: {status}")`,
    },
    problems: [
      {
        id: 'ch2_p1', title: 'Grade Calculator', difficulty: 'Easy', xp: 60,
        pattern: 'if/elif/else chain',
        story: `Given a score, print the letter grade.\n90+ → A, 80-89 → B, 70-79 → C, 60-69 → D, below 60 → F\n\nInput: 85\nOutput: B`,
        real: `Use if/elif/else with >= comparisons.\nStart from highest (90) and work down.`,
        starter: `score = 85\n\nif score >= ___:\n    print("A")\nelif score >= ___:\n    print("B")\nelif ___:\n    print("C")\nelif ___:\n    print("D")\nelse:\n    print("F")`,
        solution: `score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")`,
        expected: 'B',
        hints: ['Check from HIGHEST threshold first — if you check >=60 first, 85 would match it and print D', 'elif means "otherwise if" — it only checks if all previous were False'],
        traps: ['Checking low thresholds first gives wrong results'],
      },
      {
        id: 'ch2_p2', title: 'FizzBuzz', difficulty: 'Medium', xp: 120,
        pattern: 'Modulo + conditions (classic interview)',
        story: `The most famous interview problem ever.\n\nFor number n:\n- Divisible by 3 AND 5 → "FizzBuzz"\n- Divisible by 3 → "Fizz"\n- Divisible by 5 → "Buzz"\n- Otherwise → print the number\n\nn=15 → FizzBuzz\nn=9  → Fizz\nn=10 → Buzz\nn=7  → 7`,
        real: `n % 3 == 0 checks divisibility by 3.\nCheck BOTH (15) FIRST — otherwise 15 matches Fizz alone.`,
        starter: `n = 15\n\nif n % ___ == 0 and n % ___ == 0:\n    print("FizzBuzz")\nelif n % ___ == 0:\n    print("Fizz")\nelif n % ___ == 0:\n    print("Buzz")\nelse:\n    print(n)`,
        solution: `n = 15\nif n % 3 == 0 and n % 5 == 0:\n    print("FizzBuzz")\nelif n % 3 == 0:\n    print("Fizz")\nelif n % 5 == 0:\n    print("Buzz")\nelse:\n    print(n)`,
        expected: 'FizzBuzz',
        hints: ['% gives remainder: 15 % 3 = 0 means divisible', 'Check divisible by BOTH first — 15 % 3 = 0 AND 15 % 5 = 0'],
        traps: ['Checking 3 alone first — 15 would print Fizz not FizzBuzz'],
        leetcodeLink: 'https://leetcode.com/problems/fizz-buzz/', leetcodeNum: 412,
      },
    ],
    boss: {
      id: 'ch2_boss', title: 'The Decision Dungeon', desc: 'Categorize numbers — 4 conditions, no hints!',
      timeLimit: 300, xp: 180,
      story: `For n = 73, print its category:\n- Even AND > 50  → "Big Even"\n- Even AND ≤ 50  → "Small Even"\n- Odd AND > 50   → "Big Odd"\n- Odd AND ≤ 50   → "Small Odd"\n\nOutput: Big Odd`,
      solution: `n = 73\nif n % 2 == 0 and n > 50:\n    print("Big Even")\nelif n % 2 == 0 and n <= 50:\n    print("Small Even")\nelif n % 2 != 0 and n > 50:\n    print("Big Odd")\nelse:\n    print("Small Odd")`,
      expected: 'Big Odd',
    },
  },

  ch3: {
    id: 'ch3', phaseId: 'phase1', number: 3,
    title: 'Loops', emoji: '🔄', nextChapter: 'ch4',
    topics: ['for loops & range()', 'while loops', 'break & continue', 'Nested loops'],
    lesson: {
      hook: { title: '🤯 Loops are how computers do superhuman work', content: "Google searches 8.5 billion pages in under 1 second. That's a loop. Your phone checking for new messages every 10 seconds — while loop. Machine learning training on millions of images — nested loops. Without loops, we'd need to write the same code millions of times." },
      story: {
        title: '🤖 Byte\'s Repetition Machine',
        content: `Byte needs to print "Hello!" 1000 times.

Without loops:
  print("Hello!")
  print("Hello!")
  ... (999 more times) 😱

With a loop:
  for i in range(1000):
      print("Hello!")

The for loop says: "For each number in this sequence, run this code."

range(5)     → 0, 1, 2, 3, 4
range(1, 6)  → 1, 2, 3, 4, 5
range(0,10,2) → 0, 2, 4, 6, 8  (step of 2)

The while loop keeps going UNTIL its condition is False:
  count = 0
  while count < 5:
      print(count)
      count += 1

break → exit loop immediately (emergency stop!)
continue → skip this iteration, go to next`,
      },
      real: {
        title: '📐 Syntax & Patterns',
        content: `FOR LOOP:
  for variable in sequence:
      body

  for i in range(5):        # 0..4
  for i in range(1, 11):    # 1..10
  for i in range(10, 0, -1): # 10 down to 1
  for char in "hello":      # iterate string
  for item in my_list:      # iterate list

WHILE LOOP:
  while condition:
      body
      # MUST change condition or infinite loop!

CONTROL:
  break    → exit loop immediately
  continue → skip rest of body, next iteration

NESTED LOOPS (loop inside loop):
  for i in range(3):       # outer: 0,1,2
      for j in range(3):   # inner: 0,1,2 each outer
          print(i, j)      # 9 total combinations

COMMON PATTERNS:
  # Accumulator
  total = 0
  for n in [1,2,3,4,5]:
      total += n  # total = 15
  
  # Counter
  count = 0
  for x in data:
      if condition: count += 1`,
      },
      codeExample: `# Sum 1 to 100
total = 0
for i in range(1, 101):
    total += i
print(f"Sum: {total}")  # 5050

# Countdown with while
n = 5
while n > 0:
    print(n, end=" ")
    n -= 1
print("Go!")

# Skip evens, stop at 8
for i in range(10):
    if i % 2 == 0: continue  # skip even
    if i == 7: break          # stop at 7
    print(i, end=" ")
# Output: 1 3 5

# Multiplication table (nested)
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}×{j}={i*j}", end="  ")
    print()`,
    },
    problems: [
      {
        id: 'ch3_p1', title: 'Sum 1 to N', difficulty: 'Easy', xp: 60,
        pattern: 'Accumulator pattern',
        story: `Find the sum of all numbers from 1 to 10 using a loop.\n\nExpected output:\n55`,
        real: `Use a for loop with range(1, 11).\nAccumulate into a total variable.`,
        starter: `total = 0\nfor i in range(___, ___):\n    total += ___\nprint(total)`,
        solution: `total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)`,
        expected: '55',
        hints: ['range(1, 11) gives 1 through 10 (11 is excluded)', 'total += i adds i to total each iteration'],
        traps: ['range(10) gives 0-9, not 1-10'],
      },
      {
        id: 'ch3_p2', title: 'Star Triangle', difficulty: 'Easy', xp: 80,
        pattern: 'Nested loops / string multiplication',
        story: `Print a triangle of stars for rows = 5.\n\nExpected output:\n*\n**\n***\n****\n*****`,
        real: `for i in range(1, rows+1): print("*" * i)\nString multiplication: "*" * 3 → "***"`,
        starter: `rows = 5\nfor i in range(1, ___ + 1):\n    print("*" * ___)`,
        solution: `rows = 5\nfor i in range(1, rows + 1):\n    print("*" * i)`,
        expected: '*\n**\n***\n****\n*****',
        hints: ['"*" * 3 gives "***" — Python lets you multiply strings!', 'range(1, rows+1) gives 1, 2, 3, 4, 5'],
        traps: ['range(rows) starts at 0 — use range(1, rows+1)'],
      },
      {
        id: 'ch3_p3', title: 'Prime Checker', difficulty: 'Hard', xp: 140,
        pattern: 'Loop + break + sqrt optimization',
        story: `Check if 17 is prime (only divisible by 1 and itself).\n\nExpected output:\nPrime!`,
        real: `Check divisors from 2 to sqrt(n).\nIf any divide evenly → not prime.\nUse int(n**0.5) + 1 as range end.`,
        starter: `n = 17\nis_prime = True\n\nif n < 2:\n    is_prime = False\nelse:\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == ___:\n            is_prime = ___\n            break\n\nprint("Prime!" if is_prime else "Not Prime")`,
        solution: `n = 17\nis_prime = True\nif n < 2:\n    is_prime = False\nelse:\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            is_prime = False\n            break\nprint("Prime!" if is_prime else "Not Prime")`,
        expected: 'Prime!',
        hints: ['Only check up to sqrt(n) — no prime factors exist beyond that', 'n**0.5 is square root. n % i == 0 means i divides n evenly', 'break exits the loop immediately when we find a factor'],
        traps: ['Checking all the way to n is O(n) — sqrt is O(√n)', 'Forgetting n < 2 case (0 and 1 are not prime)'],
      },
    ],
    boss: {
      id: 'ch3_boss', title: 'Loop Labyrinth', desc: 'Sum of digits using while loop — 4 min!',
      timeLimit: 240, xp: 180,
      story: `Find the sum of digits of 12345 using a while loop.\n(Don't convert to string!)\n\nOutput: 15`,
      solution: `n = 12345\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint(total)`,
      expected: '15',
    },
  },

  // ─────────────────────────────────────────────────────
  // PHASE 2
  // ─────────────────────────────────────────────────────
  ch4: {
    id: 'ch4', phaseId: 'phase2', number: 4,
    title: 'Functions', emoji: '⚙️', nextChapter: 'ch5',
    topics: ['def, parameters, return', 'Default args', '*args', 'Lambda', 'Scope'],
    lesson: {
      hook: { title: '🤯 Functions are reusable machines', content: "print() is a function. len() is a function. You've been using functions all along. Now you'll build your own. Functions are how you write code once and use it a thousand times — the core of all software engineering." },
      story: {
        title: "🍕 Byte's Pizza Machine",
        content: `Byte builds a pizza machine that takes ingredients and returns a pizza.

def make_pizza(size, topping):
    return f"A {size} pizza with {topping}!"

Now he calls it over and over:
  make_pizza("large", "pepperoni")  → "A large pizza with pepperoni!"
  make_pizza("small", "mushrooms")  → "A small pizza with mushrooms!"

def = builds the machine
Parameters = ingredients going IN
return = finished product coming OUT
Calling = feeding ingredients to the machine

Without functions, you'd rewrite the same logic everywhere.
With functions, you write once, use anywhere.`,
      },
      real: {
        title: '📐 Syntax & Patterns',
        content: `DEFINING:
  def function_name(param1, param2):
      # body
      return result

CALLING:
  result = function_name(arg1, arg2)

DEFAULT PARAMETERS:
  def greet(name, msg="Hello"):
      print(f"{msg}, {name}!")
  greet("Byte")         → Hello, Byte!
  greet("Byte", "Hi")   → Hi, Byte!

*args (variable positional arguments):
  def add_all(*numbers):
      return sum(numbers)
  add_all(1, 2, 3)    → 6
  add_all(10, 20)     → 30

LAMBDA (one-liner anonymous function):
  square = lambda x: x ** 2
  double = lambda x: x * 2
  square(5)   → 25

SCOPE:
  x = 10          # global scope
  def f():
      y = 20      # local scope — dies when f() ends
      print(x)    # can READ global
  # print(y)      # ❌ y doesn't exist here

RETURN vs PRINT:
  def add(a, b): return a + b     # ✓ reusable value
  def add(a, b): print(a + b)     # ✗ prints but returns None`,
      },
      codeExample: `# Basic function with return
def area(length, width):
    return length * width

print(area(5, 3))   # 15
print(area(10, 4))  # 40

# Default parameters
def power(base, exp=2):
    return base ** exp

print(power(3))     # 9 (default exp=2)
print(power(2, 10)) # 1024

# *args - accept any number of arguments
def total(*nums):
    return sum(nums)

print(total(1, 2, 3, 4, 5))  # 15

# Lambda
square = lambda x: x ** 2
nums = [1, 2, 3, 4, 5]
squares = list(map(square, nums))
print(squares)  # [1, 4, 9, 16, 25]`,
    },
    problems: [
      {
        id: 'ch4_p1', title: 'Calculator Functions', difficulty: 'Easy', xp: 70,
        pattern: 'Functions with return',
        story: `Build 3 math functions:\nadd(3, 4)      → 7\nsubtract(10, 3) → 7\nmultiply(4, 5)  → 20\n\nExpected output:\n7\n7\n20`,
        real: `Define 3 functions using def.\nEach takes 2 params and returns the result.`,
        starter: `def add(a, b):\n    return ___\n\ndef subtract(a, b):\n    return ___\n\ndef multiply(a, b):\n    return ___\n\nprint(add(3, 4))\nprint(subtract(10, 3))\nprint(multiply(4, 5))`,
        solution: `def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\ndef multiply(a, b):\n    return a * b\n\nprint(add(3, 4))\nprint(subtract(10, 3))\nprint(multiply(4, 5))`,
        expected: '7\n7\n20',
        hints: ['return sends a value back to the caller', 'def add(a, b): return a + b'],
        traps: ['Using print instead of return — print returns None!'],
      },
      {
        id: 'ch4_p2', title: 'Factorial Function', difficulty: 'Medium', xp: 100,
        pattern: 'Loop inside function',
        story: `5! = 5 × 4 × 3 × 2 × 1 = 120\n\nfactorial(5) → 120\nfactorial(1) → 1\nfactorial(0) → 1`,
        real: `Start with result = 1.\nMultiply by each number from 1 to n.`,
        starter: `def factorial(n):\n    result = 1\n    for i in range(1, ___ + 1):\n        result *= ___\n    return ___\n\nprint(factorial(5))\nprint(factorial(1))\nprint(factorial(0))`,
        solution: `def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(5))\nprint(factorial(1))\nprint(factorial(0))`,
        expected: '120\n1\n1',
        hints: ['range(1, n+1) gives 1 through n', 'result *= i multiplies result by i each step'],
        traps: ['range(n) misses n itself — use range(1, n+1)'],
      },
    ],
    boss: {
      id: 'ch4_boss', title: 'Function Factory', desc: 'Build 3 functions in one go!',
      timeLimit: 300, xp: 200,
      story: `Write these 3 functions:\n1. is_even(n) → True/False\n2. celsius_to_f(c) → c * 9/5 + 32\n3. clamp(val, min_v, max_v) → keeps val within [min_v, max_v]\n\nprint(is_even(4))           → True\nprint(celsius_to_f(100))    → 212.0\nprint(clamp(15, 0, 10))     → 10`,
      solution: `def is_even(n):\n    return n % 2 == 0\n\ndef celsius_to_f(c):\n    return c * 9/5 + 32\n\ndef clamp(val, min_v, max_v):\n    if val < min_v: return min_v\n    if val > max_v: return max_v\n    return val\n\nprint(is_even(4))\nprint(celsius_to_f(100))\nprint(clamp(15, 0, 10))`,
      expected: 'True\n212.0\n10',
    },
  },

  ch5: {
    id: 'ch5', phaseId: 'phase2', number: 5,
    title: 'Lists & Arrays', emoji: '📋', nextChapter: 'ch6',
    topics: ['Indexing & slicing', 'List methods', '2D arrays', 'List comprehensions'],
    lesson: {
      hook: { title: '🤯 Your entire social feed is a list of lists', content: "Instagram's feed is a list of posts. Each post is a list of: image, caption, likes, comments. Your contacts are a list. Search results are a list. Lists are the most-used data structure in all of programming — and Python makes them incredibly powerful." },
      story: {
        title: "📦 Byte's Smart Shelf",
        content: `A Python list is like a numbered shelf. Each slot holds a value, numbered from 0.

shelf = ["sword", "potion", "map", "gold"]
         slot 0    slot 1   slot 2  slot 3

shelf[0]   → "sword"   (first)
shelf[1]   → "potion"  (second)
shelf[-1]  → "gold"    (last! negative counts from end)
shelf[-2]  → "map"     (second to last)

SLICING — grab a section:
  shelf[1:3]   → ["potion", "map"]   (slots 1, 2 — not 3!)
  shelf[:2]    → ["sword", "potion"] (from start to 2)
  shelf[2:]    → ["map", "gold"]     (from 2 to end)
  shelf[::-1]  → reversed list!

MODIFYING:
  shelf.append("key")       → add to end
  shelf.insert(0, "shield") → add at position 0
  shelf.remove("map")       → remove by value
  shelf.pop()               → remove & return last`,
      },
      real: {
        title: '📐 Methods & Patterns',
        content: `CREATION:
  nums = [1, 2, 3, 4, 5]
  mixed = [1, "hi", True, 3.14]
  empty = []
  zeros = [0] * 5   # [0, 0, 0, 0, 0]

KEY METHODS:
  .append(x)       add to end           O(1)
  .insert(i, x)    add at index i       O(n)
  .remove(x)       remove first x       O(n)
  .pop()           remove+return last   O(1)
  .pop(i)          remove+return at i   O(n)
  .sort()          sort in place        O(n log n)
  .reverse()       reverse in place     O(n)
  .index(x)        find index of x      O(n)
  .count(x)        count occurrences    O(n)
  len(lst)         length               O(1)
  sorted(lst)      returns new sorted   O(n log n)
  sum(lst)         sum all numbers      O(n)

LIST COMPREHENSION:
  squares = [x**2 for x in range(5)]
  evens = [x for x in nums if x % 2 == 0]
  doubled = [x*2 for x in nums]

2D LIST:
  grid = [[1,2,3], [4,5,6], [7,8,9]]
  grid[1][2]   → 6  (row 1, col 2)`,
      },
      codeExample: `scores = [85, 92, 78, 96, 88, 74]

# Indexing
print(scores[0])      # 85 (first)
print(scores[-1])     # 74 (last)
print(scores[1:4])    # [92, 78, 96]
print(scores[::-1])   # reversed

# Methods
scores.append(100)
scores.sort(reverse=True)
print(scores)         # [100, 96, 92, 88, 85, 78, 74]

# Useful builtins
print(max(scores))    # 100
print(min(scores))    # 74
print(sum(scores))    # 613

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(squares)        # [1, 4, 9, 16, 25]

evens = [x for x in scores if x % 2 == 0]
print(evens)          # [100, 96, 92, 88, 74]

# 2D list
matrix = [[1,2,3],[4,5,6],[7,8,9]]
print(matrix[1][2])   # 6`,
    },
    problems: [
      {
        id: 'ch5_p1', title: 'Find Max & Min', difficulty: 'Easy', xp: 70,
        pattern: 'List traversal — without builtins',
        story: `Find highest and lowest in [85, 92, 78, 96, 88, 74].\nDo NOT use max() or min().\n\nExpected output:\nMax: 96, Min: 74`,
        real: `Initialize highest and lowest to scores[0].\nIterate and update if better.`,
        starter: `scores = [85, 92, 78, 96, 88, 74]\nhighest = scores[0]\nlowest = scores[0]\n\nfor score in ___:\n    if score > ___:\n        highest = ___\n    if score < ___:\n        lowest = ___\n\nprint(f"Max: {highest}, Min: {lowest}")`,
        solution: `scores = [85, 92, 78, 96, 88, 74]\nhighest = scores[0]\nlowest = scores[0]\nfor score in scores:\n    if score > highest:\n        highest = score\n    if score < lowest:\n        lowest = score\nprint(f"Max: {highest}, Min: {lowest}")`,
        expected: 'Max: 96, Min: 74',
        hints: ['Start with highest = scores[0], not 0 — what if all numbers are negative?', 'Two separate ifs (not elif) — check BOTH for each number'],
        traps: ['Initializing to 0 fails for all-negative lists'],
      },
      {
        id: 'ch5_p2', title: 'Two Sum', difficulty: 'Hard', xp: 180,
        pattern: 'Hash map — Two Sum (LeetCode #1)',
        story: `The most famous coding interview problem.\n\nFind two numbers that add up to target. Return their indices.\n\nnums=[2,7,11,15], target=9\nOutput: [0, 1]  (because 2+7=9)`,
        real: `For each number, ask: what's needed to reach target?\ncomplement = target - num\nStore seen numbers in a dict for O(1) lookup.`,
        starter: `def two_sum(nums, target):\n    seen = {}  # value → index\n    for i, num in enumerate(nums):\n        complement = ___ - num\n        if complement in ___:\n            return [seen[complement], ___]\n        seen[___] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
        solution: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))`,
        expected: '[0, 1]',
        hints: ['For num=2, target=9: complement = 9-2 = 7. "Have I seen 7 before?"', 'Store in seen AFTER checking — avoids using the same element twice', 'enumerate() gives (index, value) pairs'],
        traps: ['Adding to dict before checking → can use same index twice'],
        leetcodeLink: 'https://leetcode.com/problems/two-sum/', leetcodeNum: 1,
      },
    ],
    boss: {
      id: 'ch5_boss', title: 'Missing Number', desc: 'Find the gap — O(1) space!',
      timeLimit: 300, xp: 200,
      story: `Array [3,1,4,2,6] should contain 1-6 but one is missing.\nFind the missing number using the sum formula.\n\nOutput: 5`,
      solution: `nums = [3, 1, 4, 2, 6]\nn = len(nums) + 1\nexpected = n * (n + 1) // 2\nprint(expected - sum(nums))`,
      expected: '5',
    },
  },

  ch6: {
    id: 'ch6', phaseId: 'phase2', number: 6,
    title: 'Strings Deep Dive', emoji: '🔤', nextChapter: 'ch7',
    topics: ['String methods', 'Palindrome & anagram', 'Sliding window intro', 'String manipulation'],
    lesson: {
      hook: { title: '🤯 ~30% of interview problems involve strings', content: 'Reverse a string, check palindrome, find anagram, longest unique substring — these are among the most common interview questions. String mastery separates candidates who "know Python" from those who can code.' },
      story: {
        title: "🔤 Byte's Codebreaker",
        content: `Byte receives a coded message: "racecar"

Is it a palindrome? Reads same forwards and backwards?

Byte's method:
1. Convert to lowercase: "racecar"
2. Reverse it: "racecar"[::-1] → "racecar"
3. They match! → Palindrome ✓

Key insight: strings in Python behave like lists of characters!
"hello"[0]   → 'h'
"hello"[-1]  → 'o'
"hello"[1:4] → 'ell'
"hello"[::-1] → 'olleh'

You can iterate over them:
for char in "hello":
    print(char)  # h, e, l, l, o`,
      },
      real: {
        title: '📐 Methods & Patterns',
        content: `ESSENTIAL METHODS:
  s.upper()           → "HELLO"
  s.lower()           → "hello"
  s.strip()           → remove leading/trailing whitespace
  s.split(",")        → ["a", "b", "c"]
  ",".join(["a","b"]) → "a,b"
  s.replace("a","b")  → replace all a with b
  s.find("lo")        → index of "lo" (-1 if not found)
  s.count("l")        → count occurrences
  s.startswith("he")  → True/False
  s.endswith("lo")    → True/False
  s.isdigit()         → all digits?
  s.isalpha()         → all letters?

REVERSAL:
  s[::-1]             → reversed string

PALINDROME:
  def is_palindrome(s):
      s = s.lower().replace(" ", "")
      return s == s[::-1]

ANAGRAM (same letters):
  def is_anagram(s1, s2):
      return sorted(s1.lower()) == sorted(s2.lower())

FREQUENCY COUNT:
  from collections import Counter
  Counter("hello")  → {'l':2, 'h':1, 'e':1, 'o':1}`,
      },
      codeExample: `# String operations
s = "Hello, World!"
print(s.lower())          # hello, world!
print(s.upper())          # HELLO, WORLD!
print(s.replace(",", "")) # Hello World!
print(s.split(", "))      # ['Hello', 'World!']

# Palindrome check
def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]

print(is_palindrome("racecar"))   # True
print(is_palindrome("hello"))     # False
print(is_palindrome("A man a plan a canal Panama"))  # True

# Anagram check
def is_anagram(s1, s2):
    return sorted(s1.lower()) == sorted(s2.lower())

print(is_anagram("listen", "silent"))  # True
print(is_anagram("hello", "world"))    # False`,
    },
    problems: [
      {
        id: 'ch6_p1', title: 'Palindrome Check', difficulty: 'Easy', xp: 80,
        pattern: 'String reversal',
        story: `Check if a string reads the same forwards and backwards (case-insensitive).\n\nis_palindrome("racecar") → True\nis_palindrome("hello")   → False\nis_palindrome("Madam")   → True`,
        real: `Lowercase the string first.\nCompare it to its reverse: s == s[::-1]`,
        starter: `def is_palindrome(s):\n    s = s.___()        # lowercase\n    return s == ___    # compare to reverse\n\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))\nprint(is_palindrome("Madam"))`,
        solution: `def is_palindrome(s):\n    s = s.lower()\n    return s == s[::-1]\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))\nprint(is_palindrome("Madam"))`,
        expected: 'True\nFalse\nTrue',
        hints: ['s[::-1] reverses a string', 's.lower() converts to lowercase — "Madam" → "madam"'],
        traps: ['Case sensitivity — "Madam" reversed is "madaM" which ≠ "Madam"'],
        leetcodeLink: 'https://leetcode.com/problems/valid-palindrome/', leetcodeNum: 125,
      },
      {
        id: 'ch6_p2', title: 'Anagram Check', difficulty: 'Easy', xp: 90,
        pattern: 'sorted() comparison',
        story: `Two words are anagrams if they use exactly the same letters.\n\nis_anagram("listen","silent") → True\nis_anagram("hello","world")  → False`,
        real: `Sort both strings and compare.\nsorted("listen") == sorted("silent") → both become ['e','i','l','n','s','t']`,
        starter: `def is_anagram(s1, s2):\n    return sorted(s1.___()) == sorted(s2.___()\n\nprint(is_anagram("listen", "silent"))\nprint(is_anagram("hello", "world"))`,
        solution: `def is_anagram(s1, s2):\n    return sorted(s1.lower()) == sorted(s2.lower())\nprint(is_anagram("listen", "silent"))\nprint(is_anagram("hello", "world"))`,
        expected: 'True\nFalse',
        hints: ['sorted("cat") → [\'a\', \'c\', \'t\'] — sorts individual characters', 'Lowercase both first to handle "Listen" vs "Silent"'],
        traps: ['Not lowercasing means "Listen" ≠ "silent"'],
        leetcodeLink: 'https://leetcode.com/problems/valid-anagram/', leetcodeNum: 242,
      },
    ],
    boss: {
      id: 'ch6_boss', title: 'String Sorcerer', desc: 'Reverse words in sentence!',
      timeLimit: 240, xp: 180,
      story: `Reverse the ORDER of words (not characters) in a sentence.\n\nInput: "Hello World CodeTale"\nOutput: CodeTale World Hello`,
      solution: `s = "Hello World CodeTale"\nwords = s.split()\nwords.reverse()\nprint(" ".join(words))`,
      expected: 'CodeTale World Hello',
    },
  },

  // ─────────────────────────────────────────────────────
  // PHASE 3 stub chapters (full content as above pattern)
  // ─────────────────────────────────────────────────────
  ch7:  { id:'ch7',  phaseId:'phase3', number:7,  title:'Hashing & Dicts',         emoji:'🗂️',  nextChapter:'ch8',  topics:['Dict basics','Frequency counter','defaultdict','Counter'], lesson:{ hook:{title:'🤯 Hash maps solve 40% of interview problems', content:'Two Sum, Group Anagrams, Word Frequency — all solved with dicts. The dict is your most powerful interview tool.'}, story:{title:"📞 Byte's Contact Book", content:'A list needs O(n) to find "Alice". A dict finds her instantly — O(1). That\'s the power of hashing.\n\ncontacts = {"Alice": "555-1234", "Bob": "555-5678"}\ncontacts["Alice"]  →  instant lookup!'}, real:{title:'📐 Dictionary Patterns', content:'CREATION:\n  d = {"key": value}\n  d[key] = value\n  d.get(key, default)\n\nFREQUENCY COUNTER:\n  freq = {}\n  for x in data:\n      freq[x] = freq.get(x, 0) + 1\n\nSAFE DEFAULTS:\n  from collections import defaultdict\n  freq = defaultdict(int)\n  freq[key] += 1\n\n  from collections import Counter\n  Counter("hello")  →  {\'l\':2, \'h\':1, \'e\':1, \'o\':1}'}, codeExample:'from collections import Counter, defaultdict\n\n# Frequency counter\nwords = "the cat sat on the mat the cat".split()\nfreq = Counter(words)\nprint(freq.most_common(3))\n\n# defaultdict\ngraph = defaultdict(list)\ngraph["A"].append("B")\ngraph["A"].append("C")\nprint(dict(graph))' }, problems:[{id:'ch7_p1',title:'Word Frequency',difficulty:'Easy',xp:90,pattern:'Frequency counter',story:'Count word occurrences in: "the cat sat on the mat the cat"\n\nOutput: {\'the\': 3, \'cat\': 2, \'sat\': 1, \'on\': 1, \'mat\': 1}',real:'Split sentence, iterate words, use dict with .get()',starter:'sentence = "the cat sat on the mat the cat"\nfreq = {}\nfor word in sentence.___():\n    freq[word] = freq.get(word, ___) + 1\nprint(freq)',solution:'sentence = "the cat sat on the mat the cat"\nfreq = {}\nfor word in sentence.split():\n    freq[word] = freq.get(word, 0) + 1\nprint(freq)',expected:"{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}",hints:['.split() splits by spaces','.get(key, 0) returns 0 if key missing'],traps:['Direct freq[word] += 1 crashes on first occurrence']}], boss:{id:'ch7_boss',title:'Hash Heist',desc:'Group anagrams!',timeLimit:360,xp:240,story:'Group ["eat","tea","tan","ate","nat","bat"] by anagram families.\n\nOutput: [[\'eat\',\'tea\',\'ate\'],[\'tan\',\'nat\'],[\'bat\']]',solution:'from collections import defaultdict\nwords = ["eat","tea","tan","ate","nat","bat"]\ngroups = defaultdict(list)\nfor w in words:\n    groups[tuple(sorted(w))].append(w)\nprint(list(groups.values()))',expected:"[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]"} },
  ch8:  { id:'ch8',  phaseId:'phase3', number:8,  title:'Stack & Queue',            emoji:'📚',  nextChapter:'ch9',  topics:['Stack LIFO','Queue FIFO','deque','Monotonic stack'], lesson:{hook:{title:'🤯 Undo/Redo uses a stack. WhatsApp uses a queue.',content:'Every browser back button is a stack. Every message queue is FIFO. These two structures power half of all algorithms.'},story:{title:'🥞 Byte\'s Plate Stack',content:'STACK (Last In, First Out):\nstack = []\nstack.append(x)  # push\nstack.pop()      # pop ← always takes from TOP\n\nQUEUE (First In, First Out):\nfrom collections import deque\nq = deque()\nq.append(x)     # enqueue\nq.popleft()     # dequeue ← takes from FRONT'},real:{title:'📐 When to use what',content:'STACK:\n  ✓ Undo/redo\n  ✓ Balanced brackets\n  ✓ DFS\n  ✓ Function call stack\n\nQUEUE:\n  ✓ BFS\n  ✓ Task scheduling\n  ✓ Print queue\n\nstack[-1]  = peek top (no remove)\nq[0]       = peek front (no remove)'},codeExample:'# Stack: valid brackets\ndef is_balanced(s):\n    stack = []\n    pairs = {")":"(", "}":"{", "]":"["}\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in ")]}":\n            if not stack or stack[-1] != pairs[ch]:\n                return False\n            stack.pop()\n    return len(stack) == 0\n\nprint(is_balanced("({[]})"))  # True\nprint(is_balanced("([)]"))    # False'},problems:[{id:'ch8_p1',title:'Valid Brackets',difficulty:'Medium',xp:130,pattern:'Stack — bracket matching',story:'Check if brackets are balanced.\n"({[]})" → True\n"([)]"   → False',real:'Push opening brackets.\nOn closing: check top matches. Pop.\nReturn empty stack at end.',starter:'def is_balanced(s):\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for ch in s:\n        if ch in "([{":\n            stack.append(___)\n        elif ch in ")]}":\n            if not stack or stack[-1] != pairs[___]:\n                return False\n            stack.___()\n    return len(stack) == 0\n\nprint(is_balanced("({[]})") )\nprint(is_balanced("([)]"))',solution:'def is_balanced(s):\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in ")]}":\n            if not stack or stack[-1] != pairs[ch]:\n                return False\n            stack.pop()\n    return len(stack) == 0\nprint(is_balanced("({[]})") )\nprint(is_balanced("([)]")',expected:'True\nFalse',hints:['Map closing→opening: ")" → "("','Check empty stack before popping!'],traps:['Not checking empty stack — pop() on empty crashes'],leetcodeLink:'https://leetcode.com/problems/valid-parentheses/',leetcodeNum:20}],boss:{id:'ch8_boss',title:'Stack Dungeon',desc:'Implement queue with two stacks!',timeLimit:420,xp:250,story:'Implement MyQueue with push/pop/peek using only two stacks.\n\nq = MyQueue()\nq.push(1); q.push(2); q.push(3)\nprint(q.pop())   → 1\nprint(q.peek())  → 2',solution:'class MyQueue:\n    def __init__(self):\n        self.s1 = []\n        self.s2 = []\n    def push(self, x):\n        self.s1.append(x)\n    def _transfer(self):\n        if not self.s2:\n            while self.s1:\n                self.s2.append(self.s1.pop())\n    def pop(self):\n        self._transfer()\n        return self.s2.pop()\n    def peek(self):\n        self._transfer()\n        return self.s2[-1]\n\nq = MyQueue()\nq.push(1); q.push(2); q.push(3)\nprint(q.pop())\nprint(q.peek())',expected:'1\n2'} },
  ch9:  { id:'ch9',  phaseId:'phase3', number:9,  title:'Linked Lists',             emoji:'🔗',  nextChapter:'ch10', topics:['Node & pointer','Traversal','Insert/Delete','Fast & slow pointer'], lesson:{hook:{title:'🤯 Git commit history is a linked list',content:'Spotify next/prev is a doubly linked list. Your browser history. Git commits. Linked lists are how data connects without fixed arrays.'},story:{title:'🚂 Byte\'s Train Cars',content:'Each car knows the NEXT car:\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nhead → [1] → [2] → [3] → None\n\nTo traverse:\ncurr = head\nwhile curr:\n    print(curr.val)\n    curr = curr.next'},real:{title:'📐 Key Operations',content:'TRAVERSAL:  O(n)\n  curr = head\n  while curr:\n      curr = curr.next\n\nINSERT AT HEAD:  O(1)\n  new.next = head\n  head = new\n\nDELETE:  O(n) to find, O(1) to delete\n  prev.next = curr.next\n\nFAST & SLOW POINTER:\n  slow = fast = head\n  while fast and fast.next:\n      slow = slow.next\n      fast = fast.next.next\n  # slow is at MIDDLE'},codeExample:'class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\n# Build: 1 → 2 → 3\nhead = Node(1)\nhead.next = Node(2)\nhead.next.next = Node(3)\n\n# Traverse\ncurr = head\nwhile curr:\n    print(curr.val, end=" → ")\n    curr = curr.next\nprint("None")'},problems:[{id:'ch9_p1',title:'Reverse Linked List',difficulty:'Medium',xp:140,pattern:'Pointer manipulation',story:'Reverse 1→2→3→4→5 to get 5→4→3→2→1',real:'Three pointers: prev=None, curr=head.\nSave next, reverse link, advance.',starter:'class Node:\n    def __init__(self, val):\n        self.val = val; self.next = None\n\ndef reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = ___\n        prev = ___\n        curr = ___\n    return prev\n\nh = Node(1); h.next=Node(2); h.next.next=Node(3)\nh = reverse(h)\nwhile h: print(h.val, end=" "); h=h.next',solution:'class Node:\n    def __init__(self, val):\n        self.val = val; self.next = None\n\ndef reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\nh = Node(1); h.next=Node(2); h.next.next=Node(3)\nh = reverse(h)\nwhile h: print(h.val, end=" "); h=h.next',expected:'3 2 1 ',hints:['Save nxt BEFORE reversing or you lose the rest','After loop, prev is the new head'],traps:['Reversing before saving next → lose rest of list'],leetcodeLink:'https://leetcode.com/problems/reverse-linked-list/',leetcodeNum:206}],boss:{id:'ch9_boss',title:'Link Fortress',desc:'Find middle with fast/slow!',timeLimit:300,xp:220,story:'Find the middle node of 1→2→3→4→5.\n\nOutput: 3',solution:'class Node:\n    def __init__(self, v): self.val=v; self.next=None\n\ndef middle(head):\n    s = f = head\n    while f and f.next:\n        s = s.next\n        f = f.next.next\n    return s.val\n\nh=Node(1);h.next=Node(2);h.next.next=Node(3);h.next.next.next=Node(4);h.next.next.next.next=Node(5)\nprint(middle(h))',expected:'3'} },
  ch10: { id:'ch10', phaseId:'phase3', number:10, title:'Recursion & Backtracking',  emoji:'🪞',  nextChapter:'ch11', topics:['Base & recursive case','Call stack','Fibonacci','Backtracking'], lesson:{hook:{title:'🤯 Recursion unlocks trees, graphs, and DP',content:'You CANNOT fully understand binary trees, DFS, or dynamic programming without recursion. It\'s the foundation. Master it here.'},story:{title:'🪞 Byte\'s Mirror Room',content:'def countdown(n):\n    if n == 0:          # BASE CASE → stop!\n        print("Go!")\n        return\n    print(n)\n    countdown(n - 1)    # RECURSIVE CALL with smaller n\n\nTWO LAWS:\n1. Must have a BASE CASE (or infinite loop!)\n2. Must call itself with a SMALLER problem\n\nThink of it like Russian dolls — each doll opens to reveal a smaller one, until you reach the smallest.'},real:{title:'📐 Patterns & Call Stack',content:'FACTORIAL:\n  def factorial(n):\n      if n == 0: return 1      # base\n      return n * factorial(n-1) # recursive\n\nFIBONACCI:\n  def fib(n):\n      if n <= 1: return n       # base\n      return fib(n-1) + fib(n-2) # recursive\n\nCALL STACK VISUALIZATION:\n  factorial(3)\n    → 3 * factorial(2)\n         → 2 * factorial(1)\n              → 1 * factorial(0) = 1\n         → 2 * 1 = 2\n    → 3 * 2 = 6\n\nBACKTRACKING TEMPLATE:\n  def backtrack(path, choices):\n      if done: result.append(path[:]); return\n      for choice in choices:\n          path.append(choice)   # choose\n          backtrack(path, ...)  # explore\n          path.pop()            # undo (backtrack!)'},codeExample:'def factorial(n):\n    if n == 0: return 1\n    return n * factorial(n-1)\n\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\nprint(factorial(5))  # 120\nprint(fib(8))        # 21\n\n# Backtracking: all permutations\ndef permutations(nums):\n    result = []\n    def backtrack(path, remaining):\n        if not remaining:\n            result.append(path[:])\n            return\n        for i in range(len(remaining)):\n            path.append(remaining[i])\n            backtrack(path, remaining[:i]+remaining[i+1:])\n            path.pop()\n    backtrack([], nums)\n    return result\n\nprint(permutations([1,2,3]))'},problems:[{id:'ch10_p1',title:'Fibonacci',difficulty:'Easy',xp:80,pattern:'Two-branch recursion',story:'Return the nth Fibonacci number.\nfib(8) → 21',real:'Base: n<=1 → return n\nRecursive: fib(n-1) + fib(n-2)',starter:'def fib(n):\n    if n <= ___:\n        return ___\n    return fib(___) + fib(___)\n\nprint(fib(8))',solution:'def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\nprint(fib(8))',expected:'21',hints:['fib(0)=0, fib(1)=1 → base case: n<=1, return n','Two recursive calls: fib(n-1) + fib(n-2)'],traps:['Missing base case → infinite recursion']},{id:'ch10_p2',title:'Power Function',difficulty:'Medium',xp:120,pattern:'Divide & conquer',story:'power(2, 10) → 1024\nUse the optimization: if exp is even → square(power(base, exp//2))',real:'Even: power(b,n) = half * half where half=power(b,n//2)\nOdd: b * power(b, n-1)',starter:'def power(base, exp):\n    if exp == 0: return ___\n    if exp % 2 == 0:\n        half = power(base, exp // ___)\n        return half * ___\n    return ___ * power(base, exp - 1)\n\nprint(power(2, 10))',solution:'def power(base, exp):\n    if exp == 0: return 1\n    if exp % 2 == 0:\n        half = power(base, exp // 2)\n        return half * half\n    return base * power(base, exp - 1)\nprint(power(2, 10))',expected:'1024',hints:['Even exponent: b^n = (b^(n/2))² — compute once, square it','Compute half ONCE and multiply by itself — not two separate calls'],traps:['Calling power twice for even case is O(n) not O(log n)'],leetcodeLink:'https://leetcode.com/problems/powx-n/',leetcodeNum:50}],boss:{id:'ch10_boss',title:'Recursion Realm',desc:'Generate all permutations!',timeLimit:420,xp:280,story:'Generate all permutations of [1,2,3].\n\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',solution:'def permutations(nums):\n    result = []\n    def backtrack(path, rem):\n        if not rem:\n            result.append(path[:])\n            return\n        for i in range(len(rem)):\n            path.append(rem[i])\n            backtrack(path, rem[:i]+rem[i+1:])\n            path.pop()\n    backtrack([], nums)\n    return result\nprint(permutations([1,2,3]))',expected:'[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]'} },

  // Phase 4-5 stubs (same structure, content abbreviated for zip size)
  ch11: { id:'ch11', phaseId:'phase4', number:11, title:'Sorting Algorithms', emoji:'📊', nextChapter:'ch12', topics:['Bubble sort','Merge sort','Quick sort','Python sort()'], lesson:{hook:{title:'🤯 Sorting is the most-studied problem in CS',content:'Merge sort powers your contacts list. Tim sort (Python\'s sort) runs your spreadsheets. Understanding sorting shows you understand divide-and-conquer.'},story:{title:'🃏 Byte Sorts Cards',content:'Merge Sort — divide and conquer:\n  Split deck in half, sort each half, merge.\n  O(n log n) — fast for any input.\n\nQuick Sort — pick a pivot:\n  Everything < pivot goes left.\n  Everything > pivot goes right.\n  O(n log n) average, O(n²) worst.'},real:{title:'📐 Algorithms',content:'BUBBLE SORT:  O(n²)\n  for i in range(n):\n      for j in range(n-i-1):\n          if arr[j] > arr[j+1]:\n              arr[j],arr[j+1] = arr[j+1],arr[j]\n\nMERGE SORT:  O(n log n)\n  Divide → sort halves → merge\n\nPYTHON BUILTIN:\n  sorted(lst)       → new sorted list\n  lst.sort()        → in-place\n  sorted(lst, reverse=True)\n  sorted(lst, key=lambda x: x[1])'},codeExample:'# Merge Sort\ndef merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    result = []\n    i = j = 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]: result.append(l[i]); i+=1\n        else: result.append(r[j]); j+=1\n    return result + l[i:] + r[j:]\n\nprint(merge_sort([38,27,43,3,9,82,10]))'},problems:[{id:'ch11_p1',title:'Bubble Sort',difficulty:'Easy',xp:80,pattern:'Nested loops + swap',story:'Sort [64,34,25,12,22,11,90] using bubble sort.\n\nOutput: [11, 12, 22, 25, 34, 64, 90]',real:'Nested loops. Compare adjacent. Swap if out of order.',starter:'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-___):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[___], arr[___]\n    return arr\n\nprint(bubble_sort([64,34,25,12,22,11,90]))',solution:'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\nprint(bubble_sort([64,34,25,12,22,11,90]))',expected:'[11, 12, 22, 25, 34, 64, 90]',hints:['Swap: a, b = b, a in Python','After each pass, largest bubbles to end'],traps:['Range should be n-i-1 to skip already-sorted end']}],boss:{id:'ch11_boss',title:'Sort Showdown',desc:'Merge sort from scratch!',timeLimit:480,xp:280,story:'Implement merge sort for [38,27,43,3,9].\n\nOutput: [3, 9, 27, 38, 43]',solution:'def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr)//2\n    l = merge_sort(arr[:mid])\n    r = merge_sort(arr[mid:])\n    res=[]; i=j=0\n    while i<len(l) and j<len(r):\n        if l[i]<=r[j]: res.append(l[i]);i+=1\n        else: res.append(r[j]);j+=1\n    return res+l[i:]+r[j:]\nprint(merge_sort([38,27,43,3,9]))',expected:'[3, 9, 27, 38, 43]'} },
  ch12: { id:'ch12', phaseId:'phase4', number:12, title:'Binary Search', emoji:'🔍', nextChapter:'ch13', topics:['Binary search','Search on answer','Rotated array','Built-in bisect'], lesson:{hook:{title:'🤯 Binary search is O(log n) magic',content:'Searching 1 billion items in 30 steps. That\'s binary search. It\'s how databases find records, how Git bisect finds bugs, how games find collision.'},story:{title:'📖 Byte\'s Guessing Game',content:'Guess a number 1-100. After each guess: "higher" or "lower".\n\nSmart strategy:\n  Guess 50. "Higher."\n  Guess 75. "Lower."\n  Guess 62. "Higher."\n  ...\n\nEach guess HALVES the search space.\n100 → 50 → 25 → 13 → ... done in 7 guesses max!\n\nBinary Search:\n  left, right = 0, len(arr)-1\n  while left <= right:\n      mid = (left+right)//2\n      if arr[mid] == target: return mid\n      elif arr[mid] < target: left = mid+1\n      else: right = mid-1'},real:{title:'📐 Template',content:'CLASSIC BINARY SEARCH:\n  def binary_search(arr, target):\n      left, right = 0, len(arr)-1\n      while left <= right:\n          mid = left + (right-left)//2  # avoid overflow\n          if arr[mid] == target: return mid\n          elif arr[mid] < target: left = mid+1\n          else: right = mid-1\n      return -1\n\n"SEARCH ON ANSWER" PATTERN:\n  When you can define: is(x) feasible?\n  Binary search on the ANSWER range.\n\nBISECT MODULE:\n  import bisect\n  bisect.bisect_left(arr, x)  # leftmost insertion point'},codeExample:'def binary_search(arr, target):\n    left, right = 0, len(arr)-1\n    while left <= right:\n        mid = (left+right)//2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid+1\n        else: right = mid-1\n    return -1\n\narr = [1,3,5,7,9,11,13,15]\nprint(binary_search(arr, 7))   # 3\nprint(binary_search(arr, 6))   # -1'},problems:[{id:'ch12_p1',title:'Binary Search',difficulty:'Easy',xp:90,pattern:'Classic binary search',story:'Find 7 in [1,3,5,7,9,11,13,15].\n\nOutput: 3 (index)',real:'left=0, right=len-1. While left<=right, check mid.',starter:'def binary_search(arr, target):\n    left, right = 0, len(arr)-1\n    while left <= ___:\n        mid = (left+right) // 2\n        if arr[mid] == target: return ___\n        elif arr[mid] < target: left = ___ + 1\n        else: right = ___ - 1\n    return -1\n\nprint(binary_search([1,3,5,7,9,11,13,15], 7))',solution:'def binary_search(arr, target):\n    left, right = 0, len(arr)-1\n    while left <= right:\n        mid = (left+right)//2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid+1\n        else: right = mid-1\n    return -1\nprint(binary_search([1,3,5,7,9,11,13,15], 7))',expected:'3',hints:['left <= right (not <) — handles single element','If arr[mid] < target, search RIGHT half: left = mid+1'],traps:['left < right misses single-element case'],leetcodeLink:'https://leetcode.com/problems/binary-search/',leetcodeNum:704}],boss:{id:'ch12_boss',title:'Binary Bastion',desc:'Search in rotated array!',timeLimit:420,xp:260,story:'Search 0 in [4,5,6,7,0,1,2].\n\nOutput: 4 (index)',solution:'def search(nums, target):\n    l, r = 0, len(nums)-1\n    while l <= r:\n        mid = (l+r)//2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid-1\n            else: l = mid+1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid+1\n            else: r = mid-1\n    return -1\nprint(search([4,5,6,7,0,1,2], 0))',expected:'4'} },
  ch13: { id:'ch13', phaseId:'phase4', number:13, title:'Two Pointers & Sliding Window', emoji:'🪟', nextChapter:'ch14', topics:['Two pointer','Same direction','Sliding window','Variable window'], lesson:{hook:{title:'🤯 These 2 patterns solve dozens of interview problems',content:'Longest substring without repeats, Container with most water, 3Sum — all two pointer or sliding window. Learn these patterns and you\'ll recognize entire categories of problems.'},story:{title:'👆👆 Byte Squeezes a Bag',content:'Two Pointer: imagine squeezing a bag from both ends.\nleft → ← right\nMove them toward each other based on conditions.\n\nSliding Window: a window sliding across data.\n[a, b, c, d, e]\n[___]              → window of size 3\n   [___]\n      [___]\n\nExpand when you need more.\nShrink when you have too much.'},real:{title:'📐 Templates',content:'TWO POINTER (sorted array):\n  left, right = 0, len(arr)-1\n  while left < right:\n      if condition: left += 1\n      else: right -= 1\n\nSLIDING WINDOW (fixed size):\n  window_sum = sum(arr[:k])\n  for i in range(k, len(arr)):\n      window_sum += arr[i] - arr[i-k]\n      max_sum = max(max_sum, window_sum)\n\nSLIDING WINDOW (variable, e.g. longest unique):\n  seen = {}\n  left = 0\n  for right, char in enumerate(s):\n      if char in seen: left = max(left, seen[char]+1)\n      seen[char] = right\n      max_len = max(max_len, right-left+1)'},codeExample:'# Longest substring without repeating chars\ndef length_of_longest(s):\n    seen = {}\n    left = max_len = 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(length_of_longest("abcabcbb"))  # 3 (abc)\nprint(length_of_longest("pwwkew"))   # 3 (wke)'},problems:[{id:'ch13_p1',title:'Two Sum II (Sorted)',difficulty:'Easy',xp:90,pattern:'Two pointer on sorted array',story:'Find two numbers summing to 9 in SORTED [2,7,11,15].\nReturn 1-indexed positions.\n\nOutput: [1, 2]',real:'left=0, right=end. Move based on sum vs target.',starter:'def two_sum(nums, target):\n    left, right = 0, len(nums)-1\n    while left < right:\n        s = nums[___] + nums[___]\n        if s == target: return [left+1, right+1]\n        elif s < target: ___ += 1\n        else: ___ -= 1\n    return []\nprint(two_sum([2,7,11,15], 9))',solution:'def two_sum(nums, target):\n    left, right = 0, len(nums)-1\n    while left < right:\n        s = nums[left] + nums[right]\n        if s == target: return [left+1, right+1]\n        elif s < target: left += 1\n        else: right -= 1\n    return []\nprint(two_sum([2,7,11,15], 9))',expected:'[1, 2]',hints:['Sum too small → move left pointer right','Sum too big → move right pointer left'],traps:['left < right not <='],leetcodeLink:'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',leetcodeNum:167}],boss:{id:'ch13_boss',title:'Window Warden',desc:'Longest substring without repeats!',timeLimit:360,xp:250,story:'Length of longest substring without repeating chars in "abcabcbb".\n\nOutput: 3',solution:'def length_of_longest(s):\n    seen = {}\n    left = res = 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch]+1\n        seen[ch] = right\n        res = max(res, right-left+1)\n    return res\nprint(length_of_longest("abcabcbb"))',expected:'3'} },
  ch14: { id:'ch14', phaseId:'phase4', number:14, title:'Greedy Algorithms', emoji:'🤑', nextChapter:'ch15', topics:['Greedy choice','Activity selection','Jump Game','Interval problems'], lesson:{hook:{title:'🤯 Greedy: always pick the locally optimal choice',content:'Dijkstra\'s shortest path is greedy. Huffman encoding for compression is greedy. Many scheduling problems. The key insight: sometimes local optimal → global optimal.'},story:{title:'💰 Byte the Greedy Merchant',content:'Byte can jump in an array. Each number = max jump length.\n[2, 3, 1, 1, 4]\n\nGreedy: at each position, track the FARTHEST you can reach.\n  pos 0: can reach 0+2=2\n  pos 1: can reach 1+3=4 ← farthest!\n  pos 2: can reach 2+1=3\n  ...\n  max_reach >= last_index → can reach end!'},real:{title:'📐 Greedy Template',content:'GREEDY PATTERN:\n  1. Sort (often needed)\n  2. Iterate and make locally optimal choice\n  3. Prove locally optimal = globally optimal\n\nJUMP GAME:\n  max_reach = 0\n  for i, jump in enumerate(nums):\n      if i > max_reach: return False  # stuck!\n      max_reach = max(max_reach, i + jump)\n  return True\n\nWHEN GREEDY WORKS:\n  ✓ Exchange argument proof\n  ✓ Problem has "optimal substructure"\n  ✗ When local choices conflict globally → use DP'},codeExample:'# Jump Game\ndef can_jump(nums):\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach:\n            return False\n        max_reach = max(max_reach, i + jump)\n    return True\n\nprint(can_jump([2,3,1,1,4]))  # True\nprint(can_jump([3,2,1,0,4]))  # False'},problems:[{id:'ch14_p1',title:'Jump Game',difficulty:'Medium',xp:120,pattern:'Greedy — max reach',story:'Can you reach the last index?\n[2,3,1,1,4] → True\n[3,2,1,0,4] → False',real:'Track max_reach. If i > max_reach, you\'re stuck.',starter:'def can_jump(nums):\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > ___: return False\n        max_reach = max(___, i + ___)\n    return True\n\nprint(can_jump([2,3,1,1,4]))\nprint(can_jump([3,2,1,0,4]))',solution:'def can_jump(nums):\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + jump)\n    return True\nprint(can_jump([2,3,1,1,4]))\nprint(can_jump([3,2,1,0,4]))',expected:'True\nFalse',hints:['max_reach tracks farthest you can go','If current index > max_reach, you\'re stuck — can\'t proceed'],traps:['Checking i >= max_reach too early'],leetcodeLink:'https://leetcode.com/problems/jump-game/',leetcodeNum:55}],boss:{id:'ch14_boss',title:'Greedy Gauntlet',desc:'Minimum coins!',timeLimit:300,xp:240,story:'Minimum coins to make 11 cents with [1,5,6,9] coins.\n\nOutput: 2 (9+2? No — use greedy: 9+1+1=3... actually optimal is 2: get it!)',solution:'# Note: greedy doesn\'t always work for coin change!\n# For this specific set [1,5,6,9], target=11:\n# Greedy: 9+1+1=3 but optimal=2 (5+6)\n# This shows greedy LIMITATION - DP is better here\n# But for standard coins [1,5,10,25] greedy works:\ndef min_coins_greedy(coins, amount):\n    coins.sort(reverse=True)\n    count = 0\n    for c in coins:\n        count += amount // c\n        amount %= c\n    return count\n\nprint(min_coins_greedy([1,5,10,25], 36))',expected:'3'} },

  // Phase 5
  ch15: { id:'ch15', phaseId:'phase5', number:15, title:'Trees & BST', emoji:'🌳', nextChapter:'ch16', topics:['Binary tree','DFS: pre/in/post order','BFS level order','BST operations'], lesson:{hook:{title:'🤯 File systems, JSON, DOM — all trees',content:'Your computer\'s folders are a tree. HTML is a tree (DOM). JSON is a tree. Databases use B-trees. Trees are everywhere in computing.'},story:{title:'🌳 Byte\'s Family Tree',content:'A tree has nodes. Each node has at most 2 children (binary tree).\n\nclass TreeNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nDFS traversals:\n  Pre-order:  root → left → right\n  In-order:   left → root → right  (BST: sorted!)\n  Post-order: left → right → root\n\nBFS: level by level (use a queue!)'},real:{title:'📐 Tree Patterns',content:'DFS (recursive):\n  def inorder(node):\n      if not node: return\n      inorder(node.left)\n      print(node.val)    # visit\n      inorder(node.right)\n\nBFS (iterative):\n  from collections import deque\n  q = deque([root])\n  while q:\n      node = q.popleft()\n      if node.left: q.append(node.left)\n      if node.right: q.append(node.right)\n\nBST PROPERTY:\n  left.val < node.val < right.val\n  In-order traversal = sorted!'},codeExample:'class TreeNode:\n    def __init__(self, val):\n        self.val=val; self.left=self.right=None\n\n# Build:     4\n#           / \\\n#          2   6\n#         / \\ / \\\n#        1  3 5  7\nroot=TreeNode(4)\nroot.left=TreeNode(2); root.right=TreeNode(6)\nroot.left.left=TreeNode(1); root.left.right=TreeNode(3)\nroot.right.left=TreeNode(5); root.right.right=TreeNode(7)\n\ndef inorder(node):\n    if not node: return\n    inorder(node.left)\n    print(node.val, end=" ")\n    inorder(node.right)\n\ninorder(root)  # 1 2 3 4 5 6 7'},problems:[{id:'ch15_p1',title:'Max Depth',difficulty:'Easy',xp:90,pattern:'DFS recursion on tree',story:'Find max depth of a binary tree.\nOutput: 3',real:'depth = 1 + max(left_depth, right_depth)\nBase case: node is None → return 0',starter:'class TreeNode:\n    def __init__(self,v): self.val=v;self.left=self.right=None\n\ndef max_depth(node):\n    if not ___: return 0\n    return 1 + max(max_depth(node.___), max_depth(node.___))    \n\nr=TreeNode(1);r.left=TreeNode(2);r.right=TreeNode(3);r.left.left=TreeNode(4)\nprint(max_depth(r))',solution:'class TreeNode:\n    def __init__(self,v): self.val=v;self.left=self.right=None\n\ndef max_depth(node):\n    if not node: return 0\n    return 1 + max(max_depth(node.left), max_depth(node.right))\n\nr=TreeNode(1);r.left=TreeNode(2);r.right=TreeNode(3);r.left.left=TreeNode(4)\nprint(max_depth(r))',expected:'3',hints:['Base case: None node has depth 0','Each node adds 1 to the max of its children\'s depths'],traps:['Forgetting base case — NoneType has no .left'],leetcodeLink:'https://leetcode.com/problems/maximum-depth-of-binary-tree/',leetcodeNum:104}],boss:{id:'ch15_boss',title:'Tree Titan',desc:'Level order traversal!',timeLimit:420,xp:260,story:'Print level order traversal of the tree.\n\nOutput: [[1], [2, 3], [4, 5]]',solution:'from collections import deque\nclass TreeNode:\n    def __init__(self,v): self.val=v;self.left=self.right=None\n\ndef level_order(root):\n    if not root: return []\n    result=[]; q=deque([root])\n    while q:\n        level=[]\n        for _ in range(len(q)):\n            node=q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        result.append(level)\n    return result\n\nr=TreeNode(1);r.left=TreeNode(2);r.right=TreeNode(3);r.left.left=TreeNode(4);r.left.right=TreeNode(5)\nprint(level_order(r))',expected:'[[1], [2, 3], [4, 5]]'} },
  ch16: { id:'ch16', phaseId:'phase5', number:16, title:'Graphs (BFS/DFS)', emoji:'🕸️', nextChapter:'ch17', topics:['Adjacency list','BFS','DFS','Cycle detection','Topological sort'], lesson:{hook:{title:'🤯 Social networks, maps, web crawlers — all graphs',content:'Google Maps uses graph BFS/DFS. Facebook friend suggestions use graph algorithms. Package dependency resolution is topological sort. Graphs are the most powerful data structure.'},story:{title:'🗺️ Byte\'s City Map',content:'A graph is nodes connected by edges.\n\ngraph = {\n  "A": ["B", "C"],\n  "B": ["A", "D"],\n  "C": ["A"],\n  "D": ["B"]\n}\n\nBFS: visit nearest neighbors first (level by level)\nDFS: go as deep as possible, then backtrack\n\nBFS finds SHORTEST PATH.\nDFS finds connectivity.'},real:{title:'📐 BFS & DFS Templates',content:'BFS:\n  from collections import deque\n  def bfs(graph, start):\n      visited = set([start])\n      q = deque([start])\n      while q:\n          node = q.popleft()\n          for neighbor in graph[node]:\n              if neighbor not in visited:\n                  visited.add(neighbor)\n                  q.append(neighbor)\n\nDFS (recursive):\n  def dfs(graph, node, visited=None):\n      if visited is None: visited = set()\n      visited.add(node)\n      for neighbor in graph[node]:\n          if neighbor not in visited:\n              dfs(graph, neighbor, visited)'},codeExample:'from collections import deque\n\ngraph = {\n  1:[2,3], 2:[1,4], 3:[1,5], 4:[2], 5:[3]\n}\n\n# BFS from node 1\ndef bfs(graph, start):\n    visited=set([start]); q=deque([start]); order=[]\n    while q:\n        node=q.popleft(); order.append(node)\n        for nb in graph[node]:\n            if nb not in visited:\n                visited.add(nb); q.append(nb)\n    return order\n\nprint(bfs(graph, 1))  # [1, 2, 3, 4, 5]'},problems:[{id:'ch16_p1',title:'Number of Islands',difficulty:'Medium',xp:150,pattern:'Grid DFS/BFS',story:'Count islands of \'1\'s in this grid:\n[["1","1","0"],["1","0","0"],["0","0","1"]]\n\nOutput: 2',real:'DFS from each unvisited \'1\', mark visited by setting to \'0\'.',starter:'def num_islands(grid):\n    count = 0\n    def dfs(i, j):\n        if i<0 or j<0 or i>=len(grid) or j>=len(grid[0]) or grid[i][j]!=\'1\':\n            return\n        grid[i][j] = \'0\'  # mark visited\n        dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)\n    for i in range(len(grid)):\n        for j in range(len(grid[0])):\n            if grid[i][j] == \'1\':\n                ___\n                count += ___\n    return count\n\nprint(num_islands([["1","1","0"],["1","0","0"],["0","0","1"]]))',solution:'def num_islands(grid):\n    count=0\n    def dfs(i,j):\n        if i<0 or j<0 or i>=len(grid) or j>=len(grid[0]) or grid[i][j]!="1": return\n        grid[i][j]="0"\n        dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1)\n    for i in range(len(grid)):\n        for j in range(len(grid[0])):\n            if grid[i][j]=="1":\n                dfs(i,j); count+=1\n    return count\nprint(num_islands([["1","1","0"],["1","0","0"],["0","0","1"]]))',expected:'2',hints:['DFS explores all connected land, marking as visited','Count how many times you START a DFS (= number of islands)'],traps:['Forgetting bounds checking in DFS'],leetcodeLink:'https://leetcode.com/problems/number-of-islands/',leetcodeNum:200}],boss:{id:'ch16_boss',title:'Graph Guardian',desc:'BFS shortest path!',timeLimit:420,xp:280,story:'Shortest path from 0 to 5 in graph {0:[1,2],1:[0,3],2:[0,3],3:[1,2,5],4:[5],5:[3,4]}.\n\nOutput: 3',solution:'from collections import deque\ngraph={0:[1,2],1:[0,3],2:[0,3],3:[1,2,5],4:[5],5:[3,4]}\ndef shortest(g,s,t):\n    q=deque([(s,0)]);visited=set([s])\n    while q:\n        node,dist=q.popleft()\n        if node==t: return dist\n        for nb in g[node]:\n            if nb not in visited:\n                visited.add(nb);q.append((nb,dist+1))\n    return -1\nprint(shortest(graph,0,5))',expected:'3'} },
  ch17: { id:'ch17', phaseId:'phase5', number:17, title:'Heaps & Priority Queues', emoji:'⛰️', nextChapter:'ch18', topics:['Min heap','Max heap','heapq module','K-th largest','Median'], lesson:{hook:{title:'🤯 Dijkstra\'s algorithm uses a heap',content:'Heap powers shortest path, K closest points, Median of stream, top K elements. Every task scheduler uses a priority queue (heap).'},story:{title:'🏥 Byte\'s Emergency Queue',content:'A heap is a COMPLETE binary tree where every parent is smaller than children (min-heap).\n\nThe TOP always has the MINIMUM.\n\nPython heapq:\n  import heapq\n  h = []\n  heapq.heappush(h, 5)   # add\n  heapq.heappush(h, 1)   # add\n  heapq.heappop(h)       # removes minimum → 1\n  h[0]                   # peek minimum\n\nFor MAX heap: negate values:\n  heapq.heappush(h, -val)  # push negative\n  -heapq.heappop(h)        # pop negative, negate back'},real:{title:'📐 heapq Patterns',content:'MIN HEAP:\n  import heapq\n  h = []\n  heapq.heappush(h, val)\n  heapq.heappop(h)      # removes min\n  h[0]                  # peek min (no remove)\n  heapq.heapify(lst)    # turn list into heap O(n)\n\nMAX HEAP (negate):\n  heapq.heappush(h, -val)\n  -heapq.heappop(h)\n\nK LARGEST ELEMENTS:\n  heapq.nlargest(k, nums)\n  heapq.nsmallest(k, nums)\n\nK-TH LARGEST (efficient):\n  heapq.heapify(nums)  # min heap\n  while len(h) > k:\n      heapq.heappop(h)\n  return h[0]          # k-th largest'},codeExample:'import heapq\n\n# Min heap\nh = []\nfor v in [5,3,8,1,4]: heapq.heappush(h,v)\nprint(heapq.heappop(h))  # 1 (minimum)\nprint(heapq.heappop(h))  # 3\n\n# K largest\nnums = [3,2,1,5,6,4]\nprint(heapq.nlargest(2, nums))   # [6, 5]\n\n# K-th largest with heap\ndef kth_largest(nums, k):\n    heapq.heapify(nums)\n    while len(nums) > k:\n        heapq.heappop(nums)\n    return nums[0]\n\nprint(kth_largest([3,2,1,5,6,4], 2))  # 5'},problems:[{id:'ch17_p1',title:'K-th Largest',difficulty:'Medium',xp:130,pattern:'Min heap of size K',story:'Find 2nd largest in [3,2,1,5,6,4].\n\nOutput: 5',real:'heapify list. Pop until k elements remain. Top = k-th largest.',starter:'import heapq\n\ndef kth_largest(nums, k):\n    heapq.heapify(___)\n    while len(nums) > ___:\n        heapq.heappop(___)\n    return nums[0]\n\nprint(kth_largest([3,2,1,5,6,4], 2))',solution:'import heapq\n\ndef kth_largest(nums, k):\n    heapq.heapify(nums)\n    while len(nums) > k:\n        heapq.heappop(nums)\n    return nums[0]\n\nprint(kth_largest([3,2,1,5,6,4], 2))',expected:'5',hints:['heapify turns list into min-heap in O(n)','Keep popping minimums until k elements remain — the top is k-th largest'],traps:['Using nlargest is O(n log k) too but heap approach is cleaner to explain'],leetcodeLink:'https://leetcode.com/problems/kth-largest-element-in-an-array/',leetcodeNum:215}],boss:{id:'ch17_boss',title:'Heap Highlands',desc:'Top K frequent elements!',timeLimit:360,xp:260,story:'Top 2 most frequent in [1,1,1,2,2,3].\n\nOutput: [1, 2]',solution:'import heapq\nfrom collections import Counter\ndef top_k(nums, k):\n    return [x for x,_ in Counter(nums).most_common(k)]\nprint(top_k([1,1,1,2,2,3],2))',expected:'[1, 2]'} },
  ch18: { id:'ch18', phaseId:'phase5', number:18, title:'Dynamic Programming', emoji:'🧩', nextChapter:null, topics:['Memoization','Tabulation','1D DP','2D DP','Classic problems'], lesson:{hook:{title:'🤯 DP is the highest-paying algorithm skill',content:'Longest Common Subsequence, Coin Change, Edit Distance, Knapsack — all DP. DP problems appear in 60% of senior engineer interviews at FAANG. This is the hardest and most rewarding topic.'},story:{title:'🪜 Byte Climbs Stairs',content:'You can climb 1 or 2 stairs at a time. How many ways to reach stair N?\n\nN=1: [1]           → 1 way\nN=2: [1+1, 2]      → 2 ways\nN=3: [1+1+1, 1+2, 2+1] → 3 ways\nN=4: [...]          → 5 ways\n\nPattern: ways(n) = ways(n-1) + ways(n-2)\nThat\'s FIBONACCI!\n\nKey insight: solve SMALLER problems first,\nstore results (memoize), reuse them.'},real:{title:'📐 DP Approaches',content:'MEMOIZATION (top-down, recursion + cache):\n  from functools import lru_cache\n  @lru_cache(maxsize=None)\n  def fib(n):\n      if n <= 1: return n\n      return fib(n-1) + fib(n-2)\n\nTABULATION (bottom-up, iterative):\n  dp = [0] * (n+1)\n  dp[0] = 0; dp[1] = 1\n  for i in range(2, n+1):\n      dp[i] = dp[i-1] + dp[i-2]\n\nSTEPS TO SOLVE DP:\n  1. Define subproblem: dp[i] = ?\n  2. Base cases\n  3. Recurrence relation\n  4. Order of computation\n  5. Answer location in dp table'},codeExample:'# Climbing Stairs (tabulation)\ndef climb_stairs(n):\n    if n <= 2: return n\n    dp = [0] * (n+1)\n    dp[1] = 1\n    dp[2] = 2\n    for i in range(3, n+1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint(climb_stairs(5))   # 8\nprint(climb_stairs(10))  # 89\n\n# Coin Change (min coins)\ndef coin_change(coins, amount):\n    dp = [float("inf")] * (amount+1)\n    dp[0] = 0\n    for a in range(1, amount+1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a-c]+1)\n    return dp[amount] if dp[amount] != float("inf") else -1\n\nprint(coin_change([1,5,10,25], 36))  # 3'},problems:[{id:'ch18_p1',title:'Climbing Stairs',difficulty:'Easy',xp:100,pattern:'1D DP (Fibonacci variant)',story:'Climb N=6 stairs (1 or 2 at a time). How many distinct ways?\n\nOutput: 13',real:'dp[i] = dp[i-1] + dp[i-2]\ndp[1]=1, dp[2]=2',starter:'def climb_stairs(n):\n    if n <= 2: return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    dp[2] = ___\n    for i in range(3, ___ + 1):\n        dp[i] = dp[___] + dp[___]\n    return dp[n]\n\nprint(climb_stairs(6))',solution:'def climb_stairs(n):\n    if n <= 2: return n\n    dp = [0] * (n+1)\n    dp[1] = 1\n    dp[2] = 2\n    for i in range(3, n+1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\nprint(climb_stairs(6))',expected:'13',hints:['dp[i] = ways to reach stair i = ways from i-1 + ways from i-2','dp[1]=1 (one way), dp[2]=2 (1+1 or 2)'],traps:['It\'s fibonacci shifted by 1'],leetcodeLink:'https://leetcode.com/problems/climbing-stairs/',leetcodeNum:70},{id:'ch18_p2',title:'Coin Change',difficulty:'Medium',xp:160,pattern:'1D DP — unbounded knapsack',story:'Minimum coins to make 11 with [1,5,6,9].\n\nOutput: 2 (5+6)',real:'dp[amount] = min coins to make that amount.\ndp[0]=0, dp[i] = min(dp[i], dp[i-c]+1) for each coin c.',starter:'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = ___\n    for a in range(1, amount + 1):\n        for c in ___:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a-c] + ___)\n    return dp[amount] if dp[amount] != float("inf") else -1\n\nprint(coin_change([1,5,6,9], 11))',solution:'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount+1)\n    dp[0] = 0\n    for a in range(1, amount+1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a-c]+1)\n    return dp[amount] if dp[amount] != float("inf") else -1\nprint(coin_change([1,5,6,9], 11))',expected:'2',hints:['dp[0]=0 — zero coins for amount 0','For each amount, try all coins and take minimum'],traps:['Greedy fails here — greedy picks 9+1+1=3, but optimal is 5+6=2'],leetcodeLink:'https://leetcode.com/problems/coin-change/',leetcodeNum:322}],boss:{id:'ch18_boss',title:'DP Dragon Final',desc:'Longest Common Subsequence!',timeLimit:480,xp:300,story:'LCS of "abcde" and "ace".\n\nOutput: 3 (ace)',solution:'def lcs(s1, s2):\n    m,n=len(s1),len(s2)\n    dp=[[0]*(n+1) for _ in range(m+1)]\n    for i in range(1,m+1):\n        for j in range(1,n+1):\n            if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]+1\n            else: dp[i][j]=max(dp[i-1][j],dp[i][j-1])\n    return dp[m][n]\nprint(lcs("abcde","ace"))',expected:'3'} },
};

// ════════════════════════════════════════════════════════
// INTERVIEW GALAXY
// ════════════════════════════════════════════════════════
export const PATTERNS = [
  { id:'two_pointer',    name:'Two Pointer',          emoji:'👆👆', difficulty:'Medium', minChapters:6,  desc:'Two indices moving toward each other or same direction', examples:['Two Sum II','Container Most Water','3Sum'] },
  { id:'sliding_window', name:'Sliding Window',        emoji:'🪟',  difficulty:'Medium', minChapters:6,  desc:'Maintain a window of elements as you slide through', examples:['Longest Substring No Repeat','Max Sum Subarray K','Min Window Substring'] },
  { id:'fast_slow',      name:'Fast & Slow Pointer',   emoji:'🐇🐢',difficulty:'Medium', minChapters:9,  desc:'Two pointers at different speeds — cycle detection', examples:['Linked List Cycle','Middle of List','Happy Number'] },
  { id:'binary_search',  name:'Binary Search',         emoji:'🔍',  difficulty:'Medium', minChapters:12, desc:'Divide search space in half each step — O(log n)', examples:['Search Rotated Array','Find Peak','Koko Eating Bananas'] },
  { id:'merge_intervals', name:'Merge Intervals',      emoji:'📏',  difficulty:'Medium', minChapters:14, desc:'Sort intervals, merge overlapping ones', examples:['Merge Intervals','Insert Interval','Meeting Rooms'] },
  { id:'tree_dfs',       name:'Tree DFS',              emoji:'🌳',  difficulty:'Medium', minChapters:15, desc:'Pre/in/post order traversal using recursion', examples:['Path Sum','Max Path Sum','Lowest Common Ancestor'] },
  { id:'tree_bfs',       name:'Tree BFS',              emoji:'🌲',  difficulty:'Hard',   minChapters:15, desc:'Level-order traversal using a queue', examples:['Level Order','Right Side View','Zigzag Traversal'] },
  { id:'backtracking',   name:'Backtracking',          emoji:'↩️',  difficulty:'Hard',   minChapters:10, desc:'Try all paths, undo bad choices, explore options', examples:['Permutations','N-Queens','Word Search'] },
  { id:'greedy',         name:'Greedy',                emoji:'🤑',  difficulty:'Medium', minChapters:14, desc:'Always pick locally optimal choice', examples:['Jump Game','Gas Station','Assign Cookies'] },
  { id:'dynamic_prog',   name:'Dynamic Programming',   emoji:'🧩',  difficulty:'Hard',   minChapters:18, desc:'Break into subproblems, memoize overlapping solutions', examples:['Climb Stairs','Coin Change','LCS'] },
  { id:'heap_top_k',     name:'Top K / Heap',          emoji:'⛰️',  difficulty:'Medium', minChapters:17, desc:'Use heap to efficiently find top K elements', examples:['K Largest','Top K Frequent','Median Stream'] },
  { id:'graph_bfs',      name:'Graph BFS/DFS',         emoji:'🕸️',  difficulty:'Hard',   minChapters:16, desc:'Traverse graphs to find paths and components', examples:['Number Islands','Clone Graph','Course Schedule'] },
];

export const COMPANY_DUNGEONS = [
  { id:'tcs',     name:'TCS Dungeon',     emoji:'🏛️', desc:'Logical reasoning, basic DSA, aptitude',    questionCount:15, topics:['Arrays','Strings','Math','Basic Logic'],         minChapters:3 },
  { id:'infosys', name:'Infosys Temple',  emoji:'🏯', desc:'Pattern-based, medium DSA',                 questionCount:15, topics:['Sorting','Hashing','Recursion','OOP'],            minChapters:6 },
  { id:'amazon',  name:'Amazon Fortress', emoji:'🏰', desc:'Arrays + DP heavy, leadership principles',   questionCount:20, topics:['Arrays','DP','Trees','System Design Basics'],    minChapters:15 },
  { id:'google',  name:'Google Galaxy',   emoji:'🌌', desc:'Graphs, hard DP, optimization',              questionCount:20, topics:['Graphs','Advanced DP','Tries','Segment Trees'],  minChapters:18 },
];
