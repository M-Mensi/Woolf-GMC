export class LoanPolicy {
  canBorrow() {
    throw new Error("canBorrow() must be implemented");
  }

  getLoanPeriodDays() {
    throw new Error("getLoanPeriodDays() must be implemented");
  }
}

export class StandardLoanPolicy extends LoanPolicy {
  canBorrow(member) {
    return member.borrowedBookIds.length < member.borrowLimit;
  }

  getLoanPeriodDays() {
    return 14;
  }
}

export class StudentLoanPolicy extends LoanPolicy {
  canBorrow(member) {
    return member.borrowedBookIds.length < member.borrowLimit;
  }

  getLoanPeriodDays() {
    return 21;
  }
}
