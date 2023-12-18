import { useSelector } from "react-redux"
import Input from "../components/Input"
import RenderSelect from "../components/RenderSelect"
import Button from "../components/Button"
const MapFields = ({
  columns,
  onMissMatchFieldChange,
  data,
  handleCloseModal,
}) => {
  const { workOrderFields } = useSelector((state) => state)
  const checkForDisable = (field) => {
    let obj = data ? data[0] : null
    if (obj) {
      return field in obj
    }
  }
  return (
    <div className="d-grid gap-2">
      {columns.map((m, index) => {
        return (
          m.path != "error" && (
            <div className="d-flex gap-4 m-2" key={m.path + index}>
              <div className="col">
                <Input name={m.path} value={m.label} fullWidth disabled />
              </div>
              <div className="d-flex col">
                <RenderSelect
                  name={m.path}
                  value={m.path}
                  options={[
                    { path: "", label: "Don't Import" },
                    ...workOrderFields,
                  ]}
                  onClick={(selectedValue) => {
                    onMissMatchFieldChange(index, selectedValue, m.path)
                  }}
                  checkForDisable={checkForDisable}
                  onChange={() => {}}
                  className="flex-grow-1"
                />
              </div>
            </div>
          )
        )
      })}
      <div className="d-flex justify-content-end m-2">
        <Button name="Submit" onClick={handleCloseModal} />
      </div>
    </div>
  )
}

export default MapFields
