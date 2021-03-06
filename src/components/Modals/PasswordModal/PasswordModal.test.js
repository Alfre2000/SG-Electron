import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserContext from "../../../UserContext";
import PasswordModal from "./PasswordModal";
import { adminLogin } from "../../../api/users";
jest.mock("../../../api/users", () => ({ adminLogin: jest.fn() }))

describe("Password Modal", () => {
  test("Successo immediato con show true e user admin", async () => {
    const props = { show: true, onSuccess: jest.fn(), onFail: jest.fn() };
    const userAdmin = { user: { user: { username: "test", is_staff: true } } };
    render(
      <UserContext.Provider value={userAdmin}>
        <PasswordModal {...props} />
      </UserContext.Provider>
    );
    expect(props.onSuccess).toHaveBeenCalled();
    expect(screen.queryByText(/area riservata/i)).not.toBeInTheDocument()
  });
  test("Funzionalit√† corretta con user non admin; login corretto", async () => {
    const props = { show: true, onSuccess: jest.fn(), onFail: jest.fn() };
    const userNormal = { user: { user: { username: "test", is_staff: false } } };
    adminLogin.mockImplementation(() => Promise.resolve(true));
    render(
      <UserContext.Provider value={userNormal}>
        <PasswordModal {...props} />
      </UserContext.Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "test_password" }
    })
    fireEvent.submit(screen.getByText(/conferma/i))
    await waitFor(() => expect(screen.getByPlaceholderText(/password/i)).toHaveValue(""))
    expect(props.onSuccess).toBeCalled()
  });
  test("Funzionalit√† corretta con user non admin; login errato", async () => {
    const props = { show: true, onSuccess: jest.fn(), onFail: jest.fn() };
    const userNormal = { user: { user: { username: "test", is_staff: false } } };
    adminLogin.mockImplementation(() => Promise.reject({ password: "test_error" }));
    render(
      <UserContext.Provider value={userNormal}>
        <PasswordModal {...props} />
      </UserContext.Provider>
    );
    fireEvent.submit(screen.getByText(/conferma/i))
    expect(await screen.findByText(/test_error/i)).toBeInTheDocument();
    expect(props.onSuccess).toHaveBeenCalledTimes(0)
  });
});
