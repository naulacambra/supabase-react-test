import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Avatar from './Avatar'

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e, data) => {
    console.log('updateProfile', e);
    e?.preventDefault()

    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username: data.username || username,
        website: data.website || website,
        avatar_url: data.avatar_url || avatar_url,
        updated_at: new Date(),
      }

      console.log('updated', updates)

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-live="polite">
      {loading 
        ? 'Loading ...' 
        : (
        <div className="flex row">
            <Avatar
                className="col-2 card"
                url={avatar_url}
                size={150}
                onUpload={(url) => {
                    console.log('onUpload', url)
                    setAvatarUrl(url)
                    updateProfile(null, { avatar_url: url })
                }}
            />
            <form onSubmit={updateProfile} className="form-widget col-10 card">
            <div>
                <label htmlFor="username">Name</label>
                <input
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                id="website"
                type="url"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                />
            </div>
            <div>
                <button className="button primary block" disabled={loading}>
                Update profile
                </button>
            </div>
            </form>
        </div>
      )}
      <button
        type="button"
        className="button block"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  )
}

export default Account